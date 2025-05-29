// src/pages/games/blackjack.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import { useAppContext } from "../../context/AppContext";

interface Card {
  suit: "♠" | "♥" | "♦" | "♣";
  rank: string; // "A", "2", …, "10", "J", "Q", "K"
}

const suits: Array<"♠" | "♥" | "♦" | "♣"> = ["♠", "♥", "♦", "♣"];
const ranks: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
};

const shuffle = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getCardValue = (card: Card): number => {
  if (card.rank === "A") return 11;
  if (["K", "Q", "J"].includes(card.rank)) return 10;
  return parseInt(card.rank);
};

const calculateHandValue = (hand: Card[]): number => {
  let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter((card) => card.rank === "A").length;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
};

// Función para "dormir" (delay) en milisegundos.
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export default function Blackjack() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  // Referencias para contenedores de animación.
  const deckRef = useRef<HTMLDivElement>(null);
  const dealerHandRef = useRef<HTMLDivElement>(null);
  const playerHandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoaded && !user) {
      router.push("/login");
    }
  }, [authLoaded, user, router]);

  const isLoading = !authLoaded || (authLoaded && !user);

  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [moves, setMoves] = useState<number>(0);

  // Estado para la carta en animación y sus estilos.
  const [animatingCard, setAnimatingCard] = useState<Card | null>(null);
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({ opacity: 0 });

  /**
   * animateDealCard anima una carta desde el contenedor del mazo (deckRef)
   * hasta un contenedor destino, el cual se pasa mediante destinationRef.
   * La firma se define para aceptar destinationRef de tipo React.RefObject<HTMLElement | null>.
   */
  const animateDealCard = (
    card: Card,
    destinationRef: React.RefObject<HTMLElement | null>,
    onComplete: () => void
  ) => {
    if (!deckRef.current || !destinationRef.current) {
      onComplete();
      return;
    }
    const sourceRect = deckRef.current.getBoundingClientRect();
    const destRect = destinationRef.current.getBoundingClientRect();
    const cardWidth = 112;
    const cardHeight = 144;
    const startTop = sourceRect.top;
    const startLeft = sourceRect.left;
    const endTop = destRect.top + destRect.height / 2 - cardHeight / 2;
    const endLeft = destRect.left + destRect.width / 2 - cardWidth / 2;
    
    setAnimStyle({
      position: "fixed",
      top: startTop,
      left: startLeft,
      opacity: 1,
      transition: "top 0.5s ease-out, left 0.5s ease-out, opacity 0.5s ease-out",
    });
    setAnimatingCard(card);
    requestAnimationFrame(() => {
      setAnimStyle((prev) => ({
        ...prev,
        top: endTop,
        left: endLeft,
      }));
    });
    setTimeout(() => {
      setAnimatingCard(null);
      setAnimStyle({ opacity: 0 });
      onComplete();
    }, 500);
  };

  // Reparte las cartas iniciales sin animación.
  const startGame = () => {
    const newDeck = shuffle(createDeck());
    // Se asignan directamente las cartas iniciales.
    setDealerHand([newDeck[0], newDeck[1]]);
    setPlayerHand([newDeck[2], newDeck[3]]);
    setDeck(newDeck.slice(4));
    setGameOver(false);
    setResult("");
    setMoves(0);
  };

  useEffect(() => {
    if (authLoaded && user) {
      startGame();
    }
  }, [authLoaded, user]);

  // Acción HIT: saca la siguiente carta del deck y la anima hacia la mano del jugador.
  const hit = () => {
    if (deck.length === 0 || gameOver) return;
    const newDeck = [...deck];
    const newCard = newDeck.shift()!;
    setDeck(newDeck);
    setMoves((m) => m + 1);
    animateDealCard(newCard, playerHandRef, () => {
      setPlayerHand((prev) => [...prev, newCard]);
      if (calculateHandValue([...playerHand, newCard]) > 21) {
        setGameOver(true);
        setResult("¡Te pasaste de 21! Has perdido.");
      }
    });
  };

  // Acción STAND: el jugador se planta y el dealer repite su jugada con animaciones entre carta y carta.
  const stand = async () => {
    let dHand = [...dealerHand];
    let dDeck = [...deck];
    // Antes de comenzar, agregamos un pequeño retraso para que el usuario perciba el inicio del turno del dealer.
    await sleep(500);
    while (calculateHandValue(dHand) < 17 && dDeck.length > 0) {
      const nextCard = dDeck.shift()!;
      // Anima cada carta que el dealer toma.
      await new Promise<void>((resolve) => {
        animateDealCard(nextCard, dealerHandRef, () => {
          dHand.push(nextCard);
          setDealerHand([...dHand]);
          setMoves((m) => m + 1);
          // Agregamos un retraso mayor al final de cada animación para suavizar la secuencia
          sleep(500).then(resolve);
        });
      });
    }
    setDeck(dDeck);
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dHand);
    let outcome = "";
    if (dealerTotal > 21) {
      outcome = "¡Ganaste! El dealer se pasó de 21.";
    } else if (playerTotal > dealerTotal) {
      outcome = "¡Ganaste! Tu mano es mayor.";
    } else if (playerTotal === dealerTotal) {
      outcome = "Empate.";
    } else {
      outcome = "Perdiste. El dealer gana.";
    }
    setGameOver(true);
    setResult(outcome);
  };

  const restartGame = () => {
    startGame();
  };

  // Función para renderizar una carta con estilo moderno.
  const renderCard = (card: Card, hidden: boolean = false) => {
    return (
      <div className="w-24 h-32 md:w-28 md:h-36 bg-gradient-to-r from-white to-blue-50 rounded-2xl border border-gray-200 shadow-2xl flex items-center justify-center transform transition-all hover:scale-105">
        {hidden ? (
          <span className="text-3xl font-bold text-gray-300">??</span>
        ) : (
          <span className="text-3xl font-bold text-gray-800">
            {card.rank}{card.suit}
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
        <p className="text-white text-2xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col relative">
      <BackButton />
      <Navbar />
      <header className="py-6 text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">Blackjack 21</h1>
      </header>
      <main className="flex-grow container mx-auto flex flex-col gap-10 px-4">
        {/* Sección superior: Dealer */}
        <section className="flex flex-col items-center" ref={dealerHandRef}>
          <h2 className="text-2xl font-bold text-white mb-4">Dealer (Casa)</h2>
          <div className="flex gap-6">
            {dealerHand.map((card, idx) => (
              <div key={idx}>
                {idx === 1 && !gameOver ? renderCard(card, true) : renderCard(card)}
              </div>
            ))}
          </div>
          <p className="mt-2 text-white text-xl">
            Total: {gameOver ? calculateHandValue(dealerHand) : "??"}
          </p>
        </section>

        {/* Sección central: Controles y mazo lateral */}
        <section className="flex items-center justify-center gap-10">
          <div ref={deckRef} className="w-24 h-32 md:w-28 md:h-36 flex items-center justify-center bg-gray-500 rounded-2xl shadow-2xl">
            <span className="text-3xl text-white font-bold">MAZO</span>
          </div>
          <div className="flex flex-col items-center gap-6">
            {!gameOver ? (
              <div className="flex gap-8">
                <button
                  onClick={hit}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full shadow-2xl transform transition-all hover:scale-105"
                >
                  HIT
                </button>
                <button
                  onClick={stand}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full shadow-2xl transform transition-all hover:scale-105"
                >
                  STAND
                </button>
              </div>
            ) : (
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl transform transition-all hover:scale-105"
              >
                Reiniciar
              </button>
            )}
            {result && (
              <p className="text-3xl font-bold text-white">{result}</p>
            )}
            <p className="text-xl text-white">Movimientos: {moves}</p>
          </div>
        </section>

        {/* Sección inferior: Mano del Jugador */}
        <section className="flex flex-col items-center" ref={playerHandRef}>
          <h2 className="text-2xl font-bold text-white mb-4">Jugador</h2>
          <div className="flex gap-6">
            {playerHand.map((card, idx) => (
              <div key={idx}>{renderCard(card)}</div>
            ))}
          </div>
          <p className="mt-2 text-white text-xl">
            Total: {calculateHandValue(playerHand)}
          </p>
        </section>
      </main>
      <footer className="py-4 text-center text-white text-sm">
        © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
      </footer>

      {/* Carta animada en overlay */}
      {animatingCard && (
        <div style={animStyle} className="z-50 pointer-events-none">
          <div className="w-24 h-32 md:w-28 md:h-36 bg-gradient-to-r from-white to-blue-50 rounded-2xl border border-gray-200 shadow-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">
              {animatingCard.rank}{animatingCard.suit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
