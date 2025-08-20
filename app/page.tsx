'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const colors = [
  { name: 'Red', hex: '#FF0000', rgb: [255, 0, 0], related: ['Pink', 'Orange'] },
  { name: 'Blue', hex: '#0000FF', rgb: [0, 0, 255], related: ['Light Blue', 'Dark Blue'] },
  { name: 'Green', hex: '#00FF00', rgb: [0, 255, 0], related: ['Light Green', 'Dark Green'] },
  { name: 'Yellow', hex: '#FFFF00', rgb: [255, 255, 0], related: ['Orange', 'Light Yellow'] },
  { name: 'Purple', hex: '#800080', rgb: [128, 0, 128], related: ['Pink', 'Dark Purple'] },
  { name: 'Orange', hex: '#FFA500', rgb: [255, 165, 0], related: ['Red', 'Yellow'] },
  { name: 'Pink', hex: '#FFC0CB', rgb: [255, 192, 203], related: ['Red', 'Purple'] },
  { name: 'Brown', hex: '#A52A2A', rgb: [165, 42, 42], related: ['Red', 'Dark Orange'] },
  { name: 'Black', hex: '#000000', rgb: [0, 0, 0], related: ['Dark Gray', 'Dark Blue'] },
  { name: 'White', hex: '#FFFFFF', rgb: [255, 255, 255], related: ['Light Gray', 'Light Yellow'] },
  { name: 'Gray', hex: '#808080', rgb: [128, 128, 128], related: ['Light Gray', 'Dark Gray'] },
  { name: 'Light Blue', hex: '#87CEEB', rgb: [135, 206, 235], related: ['Blue', 'Light Gray'] },
  { name: 'Dark Blue', hex: '#00008B', rgb: [0, 0, 139], related: ['Blue', 'Black'] },
  { name: 'Light Green', hex: '#90EE90', rgb: [144, 238, 144], related: ['Green', 'Light Yellow'] },
  { name: 'Dark Green', hex: '#006400', rgb: [0, 100, 0], related: ['Green', 'Black'] },
  { name: 'Light Yellow', hex: '#FFFFE0', rgb: [255, 255, 224], related: ['Yellow', 'White'] },
  { name: 'Dark Purple', hex: '#4B0082', rgb: [75, 0, 130], related: ['Purple', 'Black'] }
];

export default function GameHub() {
  const [gameMode, setGameMode] = useState<'menu' | 'colors' | 'tictactoe' | 'sudoku' | 'trivia' | 'flags' | 'patterns' | 'clickdot'>('menu');
  
  // Camera Color Game state
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedColor, setDetectedColor] = useState<string>('');
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [countdown, setCountdown] = useState(0);
  
  // Tic Tac Toe state
  const [tictactoeBoard, setTictactoeBoard] = useState(Array(9).fill(null));
  const [tictactoeXIsNext, setTictactoeXIsNext] = useState(true);
  const [tictactoeWinner, setTictactoeWinner] = useState<string | null>(null);
  const [tictactoeScore, setTictactoeScore] = useState({ X: 0, O: 0 });
  const [isAIGame, setIsAIGame] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiThinking, setAiThinking] = useState(false);
  
  // Sudoku state
  const [sudokuBoard, setSudokuBoard] = useState<(number | null)[][]>([]);
  const [sudokuSolution, setSudokuSolution] = useState<number[][]>([]);
  const [sudokuDifficulty, setSudokuDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [sudokuSelectedCell, setSudokuSelectedCell] = useState<[number, number] | null>(null);
  const [sudokuErrors, setSudokuErrors] = useState<Set<string>>(new Set());
  const [sudokuCompleted, setSudokuCompleted] = useState(false);
  const [sudokuTimer, setSudokuTimer] = useState(0);
  const [sudokuTimerActive, setSudokuTimerActive] = useState(false);
  
  // Trivia state
  const [triviaQuestions, setTriviaQuestions] = useState<any[]>([]);
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaCorrect, setTriviaCorrect] = useState<boolean | null>(null);
  const [triviaLoading, setTriviaLoading] = useState(false);
  const [triviaCategory, setTriviaCategory] = useState('general');
  const [triviaDifficulty, setTriviaDifficulty] = useState('easy');
  const [userAge, setUserAge] = useState<number | null>(null);
  const [userSubject, setUserSubject] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [triviaSetupComplete, setTriviaSetupComplete] = useState(false);
  
  // Flags game state
  const [flagCountries, setFlagCountries] = useState<Array<{ name: string; flag: string; code: string; region: string }>>([]);
  const [flagLoading, setFlagLoading] = useState(false);
  const [flagQuestion, setFlagQuestion] = useState<{ flag: string; correct: string; options: string[] } | null>(null);
  const [flagScore, setFlagScore] = useState(0);
  const [flagQuestionIndex, setFlagQuestionIndex] = useState(0);
  const [flagAnswered, setFlagAnswered] = useState(false);
  const [flagCorrect, setFlagCorrect] = useState<boolean | null>(null);
  const [flagDifficulty, setFlagDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Pattern Memory state
  const patternPads = [
    { id: 0, name: 'Red', color: '#ef4444' },
    { id: 1, name: 'Blue', color: '#3b82f6' },
    { id: 2, name: 'Green', color: '#10b981' },
    { id: 3, name: 'Yellow', color: '#f59e0b' }
  ];
  const [patternDifficulty, setPatternDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [patternSequence, setPatternSequence] = useState<number[]>([]);
  const [patternUserIndex, setPatternUserIndex] = useState(0);
  const [patternRound, setPatternRound] = useState(0);
  const [patternPlaying, setPatternPlaying] = useState(false);
  const [patternActivePad, setPatternActivePad] = useState<number | null>(null);
  const [patternScore, setPatternScore] = useState(0);

  // Click the Dot state
  const [dotScore, setDotScore] = useState(0);
  const [dotBestScore, setDotBestScore] = useState(0);
  const [dotTimeLeft, setDotTimeLeft] = useState(30);
  const [dotIsRunning, setDotIsRunning] = useState(false);
  const [dotDiameter, setDotDiameter] = useState(48);
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const dotContainerRef = useRef<HTMLDivElement>(null);
  const [dotVisible, setDotVisible] = useState(false);
  const [dotDifficulty, setDotDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const dotTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotRespawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDotInterval = () => {
    switch (dotDifficulty) {
      case 'easy':
        return 3000;
      case 'medium':
        return 2000;
      case 'hard':
        return 1000;
    }
  };

  const clearDotTimers = () => {
    if (dotTimeoutRef.current) {
      clearTimeout(dotTimeoutRef.current);
      dotTimeoutRef.current = null;
    }
    if (dotRespawnRef.current) {
      clearTimeout(dotRespawnRef.current);
      dotRespawnRef.current = null;
    }
  };

  const scheduleDotTimers = () => {
    clearDotTimers();
    const interval = getDotInterval();
    dotTimeoutRef.current = setTimeout(() => {
      setDotVisible(false);
      dotRespawnRef.current = setTimeout(() => {
        placeDotRandomly();
        setDotVisible(true);
        scheduleDotTimers();
      }, 300);
    }, interval);
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getPatternParams = () => {
    switch (patternDifficulty) {
      case 'easy':
        return { startLen: 3, gapMs: 600, onMs: 420 };
      case 'medium':
        return { startLen: 5, gapMs: 520, onMs: 350 };
      case 'hard':
        return { startLen: 7, gapMs: 430, onMs: 260 };
    }
  };

  const addRandomStep = (seq: number[]) => {
    const next = Math.floor(Math.random() * patternPads.length);
    return [...seq, next];
  };

  const playPatternSequence = async (sequence: number[]) => {
    setPatternPlaying(true);
    const { gapMs, onMs } = getPatternParams();
    for (let i = 0; i < sequence.length; i++) {
      const pad = sequence[i];
      setPatternActivePad(pad);
      await new Promise(res => setTimeout(res, onMs));
      setPatternActivePad(null);
      await new Promise(res => setTimeout(res, Math.max(120, gapMs - onMs)));
    }
    setPatternPlaying(false);
  };

  const startPatternGame = async () => {
    setPatternScore(0);
    setPatternRound(1);
    setPatternUserIndex(0);
    const { startLen } = getPatternParams();
    let seq: number[] = [];
    for (let i = 0; i < startLen; i++) seq = addRandomStep(seq);
    setPatternSequence(seq);
    setMessage('Watch the pattern...');
    await playPatternSequence(seq);
    setMessage('Repeat the pattern by clicking the colors in order.');
  };

  const nextPatternRound = async () => {
    setPatternRound(prev => prev + 1);
    setPatternUserIndex(0);
    const newSeq = addRandomStep(patternSequence);
    setPatternSequence(newSeq);
    setMessage('Watch the pattern...');
    await playPatternSequence(newSeq);
    setMessage('Your turn!');
  };

  const handlePatternPadClick = async (padId: number) => {
    if (patternPlaying || patternActivePad !== null) return;
    if (patternSequence.length === 0) return;

    const expected = patternSequence[patternUserIndex];
    if (padId === expected) {
      // feedback flash
      setPatternActivePad(padId);
      await new Promise(res => setTimeout(res, 120));
      setPatternActivePad(null);

      if (patternUserIndex === patternSequence.length - 1) {
        setPatternScore(prev => prev + 1);
        setMessage('✅ Correct! Next round...');
        setTimeout(() => {
          nextPatternRound();
        }, 600);
      } else {
        setPatternUserIndex(prev => prev + 1);
      }
    } else {
      setMessage('❌ Wrong order! Click Start to try again.');
      setPatternSequence([]);
      setPatternUserIndex(0);
      setPatternRound(0);
    }
  };



  // Text-to-speech function
  const speakColor = (colorName: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Find the color ${colorName}`);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  // Calculate color similarity using Euclidean distance
  const calculateColorSimilarity = (rgb1: number[], rgb2: number[]) => {
    const distance = Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
    // Convert distance to similarity percentage (0-100)
    return Math.max(0, 100 - (distance / 4.41)); // 4.41 is max possible distance / 100
  };

  // Check if a color is related to the target (including the target itself)
  const isRelatedColor = (colorName: string, targetColorName: string) => {
    if (colorName === targetColorName) return true;
    
    const target = colors.find(c => c.name === targetColorName);
    if (!target) return false;
    
    return target.related.includes(colorName);
  };

  // Tic Tac Toe functions
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // AI opponent logic
  const getAIMove = (board: (string | null)[], difficulty: 'easy' | 'medium' | 'hard') => {
    const availableMoves = board.map((square, index) => square === null ? index : -1).filter(index => index !== -1);
    
    if (availableMoves.length === 0) return -1;

    switch (difficulty) {
      case 'easy':
        // Random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      case 'medium':
        // 80% smart, 20% random for more challenge
        if (Math.random() < 0.8) {
          return getSmartMove(board);
        } else {
          return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
      
      case 'hard':
        // Always smart move
        return getSmartMove(board);
      
      default:
        return availableMoves[0];
    }
  };

  const getSmartMove = (board: (string | null)[]) => {
    // First, try to win
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = 'O';
        if (calculateWinner(testBoard) === 'O') {
          return i;
        }
      }
    }

    // Second, block player from winning
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = 'X';
        if (calculateWinner(testBoard) === 'X') {
          return i;
        }
      }
    }

    // Third, take center if available
    if (board[4] === null) {
      return 4;
    }

    // Fourth, take corners if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Finally, take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => board[i] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // Fallback to first available move
    return board.findIndex(square => square === null);
  };

  const handleTictactoeClick = (i: number) => {
    if (tictactoeBoard[i] || tictactoeWinner || aiThinking) return;

    const newBoard = tictactoeBoard.slice();
    // Determine current player's symbol based on whose turn it is
    const currentPlayer = tictactoeXIsNext ? 'X' : 'O';
    newBoard[i] = currentPlayer;
    setTictactoeBoard(newBoard);
    
    // Check if current player won
    const winner = calculateWinner(newBoard);
    if (winner) {
      setTictactoeWinner(winner);
      setTictactoeScore(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer as keyof typeof prev] + 1 }));
      return;
    }

    // Check for draw
    if (newBoard.every(square => square !== null)) {
      setTictactoeWinner('Draw');
      return;
    }

    // AI's turn - much faster response
    if (isAIGame) {
      setAiThinking(true);
      // Instant AI response with minimal delay for better UX
      setTimeout(() => {
        const aiMove = getAIMove(newBoard, aiDifficulty);
        if (aiMove !== -1) {
          const aiBoard = [...newBoard];
          aiBoard[aiMove] = 'O';
          setTictactoeBoard(aiBoard);
          
          // Check if AI won
          const aiWinner = calculateWinner(aiBoard);
          if (aiWinner) {
            setTictactoeWinner(aiWinner);
            setTictactoeScore(prev => ({ ...prev, O: prev.O + 1 }));
          } else if (aiBoard.every(square => square !== null)) {
            setTictactoeWinner('Draw');
          }
        }
        setAiThinking(false);
      }, 100 + Math.random() * 200); // Much faster: 100-300ms delay
    } else {
      // Two-player mode - switch turns
      setTictactoeXIsNext(!tictactoeXIsNext);
    }
  };

  const resetTictactoe = () => {
    setTictactoeBoard(Array(9).fill(null));
    setTictactoeXIsNext(true);
    setTictactoeWinner(null);
    setAiThinking(false);
  };

  const toggleGameMode = () => {
    setIsAIGame(!isAIGame);
    resetTictactoe();
  };

  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setAiDifficulty(difficulty);
    resetTictactoe();
    // Show difficulty change feedback
    setMessage(`AI difficulty set to ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}!`);
    setTimeout(() => setMessage(''), 2000);
  };

  // Sudoku functions
  const generateSudokuPuzzle = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Generate a solved Sudoku board
    const solution = generateSolvedSudoku();
    setSudokuSolution(solution);
    
    // Create puzzle by removing numbers based on difficulty
    const puzzle: (number | null)[][] = solution.map(row => row.map(v => v as number | null));
    const cellsToRemove = {
      easy: 30,
      medium: 40,
      hard: 50
    };
    
    const cellsToRemoveCount = cellsToRemove[difficulty];
    const positions: Array<[number, number]> = [];
    
    // Generate all possible positions
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    
    // Randomly remove cells
    for (let i = 0; i < cellsToRemoveCount; i++) {
      if (positions.length > 0) {
        const randomIndex = Math.floor(Math.random() * positions.length);
        const [row, col] = positions.splice(randomIndex, 1)[0];
        puzzle[row][col] = null;
      }
    }
    
    setSudokuBoard(puzzle);
    setSudokuErrors(new Set());
    setSudokuCompleted(false);
    setSudokuSelectedCell(null);
    setSudokuTimer(0);
    setSudokuTimerActive(true);
  };

  const generateSolvedSudoku = (): number[][] => {
    const board: number[][] = [];
    for (let i = 0; i < 9; i++) {
      board[i] = Array(9).fill(0);
    }
    
    // Fill diagonal 3x3 boxes first (these can be filled independently)
    for (let box = 0; box < 9; box += 4) {
      const startRow = Math.floor(box / 3) * 3;
      const startCol = (box % 3) * 3;
      fillBox(board, startRow, startCol);
    }
    
    // Fill remaining cells
    solveSudoku(board);
    
    return board;
  };

  const fillBox = (board: number[][], startRow: number, startCol: number) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        board[startRow + i][startCol + j] = numbers.splice(randomIndex, 1)[0];
      }
    }
  };

  const solveSudoku = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    
    return true;
  };

  const handleSudokuCellClick = (row: number, col: number) => {
    // Allow selecting any cell, not just empty ones
    console.log('Cell clicked:', row, col, 'Current selected cell:', sudokuSelectedCell);
    setSudokuSelectedCell([row, col]);
  };

  const handleSudokuNumberInput = (num: number) => {
    if (sudokuSelectedCell) {
      const [row, col] = sudokuSelectedCell;
      
      // Check if this is an original cell (cannot be changed)
      const isOriginal = sudokuBoard[row][col] !== null && sudokuSolution[row][col] === sudokuBoard[row][col];
      if (isOriginal) {
        return; // Don't allow changing original cells
      }
      
      const newBoard = sudokuBoard.map(r => [...r]);
      newBoard[row][col] = num === 0 ? null : num; // Handle clear cell (0)
      setSudokuBoard(newBoard);
      
      // Check for errors
      checkSudokuErrors(newBoard);
      
      // Check if completed
      if (isSudokuCompleted(newBoard)) {
        setSudokuCompleted(true);
        setSudokuTimerActive(false);
        setMessage('🎉 Congratulations! Sudoku completed!');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const checkSudokuErrors = (board: (number | null)[][]) => {
    const errors = new Set<string>();
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== null) {
          const num = board[row][col]!;
          
          // Check row
          for (let x = 0; x < 9; x++) {
            if (x !== col && board[row][x] === num) {
              errors.add(`${row}-${col}`);
              errors.add(`${row}-${x}`);
            }
          }
          
          // Check column
          for (let x = 0; x < 9; x++) {
            if (x !== row && board[x][col] === num) {
              errors.add(`${row}-${col}`);
              errors.add(`${x}-${col}`);
            }
          }
          
          // Check 3x3 box
          const startRow = Math.floor(row / 3) * 3;
          const startCol = Math.floor(col / 3) * 3;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const checkRow = startRow + i;
              const checkCol = startCol + j;
              if ((checkRow !== row || checkCol !== col) && board[checkRow][checkCol] === num) {
                errors.add(`${row}-${col}`);
                errors.add(`${checkRow}-${checkCol}`);
              }
            }
          }
        }
      }
    }
    
    setSudokuErrors(errors);
  };

  const isSudokuCompleted = (board: (number | null)[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) return false;
      }
    }
    return true;
  };

  const resetSudoku = () => {
    setSudokuBoard([]);
    setSudokuSolution([]);
    setSudokuSelectedCell(null);
    setSudokuErrors(new Set());
    setSudokuCompleted(false);
    setSudokuTimer(0);
    setSudokuTimerActive(false);
  };

  const changeSudokuDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSudokuDifficulty(difficulty);
    resetSudoku();
    generateSudokuPuzzle(difficulty);
  };

  // Trivia functions
  const fetchTriviaQuestions = async (category: string, difficulty: string) => {
    setTriviaLoading(true);
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
      );
      const data = await response.json();
      
      if (data.response_code === 0) {
        setTriviaQuestions(data.results);
        setCurrentTriviaIndex(0);
        setTriviaScore(0);
        setTriviaAnswered(false);
        setTriviaCorrect(null);
        setMessage(`🎯 Trivia loaded! ${data.results.length} questions ready.`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to load trivia questions. Please try again.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error loading trivia questions. Check your internet connection.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setTriviaLoading(false);
    }
  };

  const handleTriviaAnswer = (selectedAnswer: string) => {
    if (triviaAnswered) return;
    
    const currentQuestion = triviaQuestions[currentTriviaIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    setTriviaAnswered(true);
    setTriviaCorrect(isCorrect);
    
    if (isCorrect) {
      setTriviaScore(prev => prev + 1);
    }
    
    // Auto-advance to next question after 2 seconds
    setTimeout(() => {
      if (currentTriviaIndex < triviaQuestions.length - 1) {
        nextTriviaQuestion();
      } else {
        // Game completed
        setMessage(`🎉 Trivia completed! Final score: ${triviaScore + (isCorrect ? 1 : 0)}/${triviaQuestions.length}`);
        setTimeout(() => setMessage(''), 5000);
      }
    }, 2000);
  };

  const nextTriviaQuestion = () => {
    if (currentTriviaIndex < triviaQuestions.length - 1) {
      setCurrentTriviaIndex(prev => prev + 1);
      setTriviaAnswered(false);
      setTriviaCorrect(null);
    }
  };

  const resetTrivia = () => {
    setTriviaQuestions([]);
    setCurrentTriviaIndex(0);
    setTriviaScore(0);
    setTriviaAnswered(false);
    setTriviaCorrect(null);
    setMessage('');
  };

  const changeTriviaSettings = (category: string, difficulty: string) => {
    setTriviaCategory(category);
    setTriviaDifficulty(difficulty);
    resetTrivia();
    fetchTriviaQuestions(category, difficulty);
  };

  // Voice recognition functions
  const startVoiceRecognition = () => {
    if (typeof window !== 'undefined' && (((window as any).webkitSpeechRecognition) || ((window as any).SpeechRecognition))) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceMessage('Listening... Speak now!');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceMessage(`Heard: "${transcript}"`);
        processVoiceInput(transcript);
      };
      
      recognition.onerror = (event: any) => {
        setVoiceMessage(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      setVoiceMessage('Speech recognition not supported in this browser');
    }
  };

  const processVoiceInput = (transcript: string) => {
    // Extract age from voice input
    const ageMatch = transcript.match(/(\d+)/);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      if (age >= 5 && age <= 100) {
        setUserAge(age);
        speakMessage(`Great! You're ${age} years old. Now tell me what subject you want to learn about.`);
        return;
      }
    }
    
    // Extract subject from voice input
    const subjects = [
      'math', 'mathematics', 'science', 'history', 'geography', 'literature', 'english',
      'art', 'music', 'sports', 'animals', 'space', 'technology', 'computers',
      'movies', 'books', 'games', 'food', 'nature', 'oceans', 'mountains',
      'countries', 'cities', 'famous people', 'inventions', 'discoveries'
    ];
    
    for (const subject of subjects) {
      if (transcript.includes(subject)) {
        setUserSubject(subject);
        speakMessage(`Perfect! I'll create ${subject} trivia questions for you. Let me generate some questions now!`);
        setTimeout(() => {
          generateGeminiTrivia();
        }, 2000);
        return;
      }
    }
    
    // If no specific subject found, ask again
    speakMessage("I didn't catch that. Please tell me what subject you want to learn about.");
  };

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  // Gemini AI integration
  const generateGeminiTrivia = async () => {
    if (!userAge || !userSubject) return;
    
    setTriviaLoading(true);
    setVoiceMessage('Getting questions...');
    
    try {
      // Kids first: if age <= 6, always use server kid-mode (or local kid fallback)
      if (userAge <= 6) {
        try {
          const response = await fetch('/api/gemini-trivia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ age: userAge, subject: userSubject, difficulty: 'easy' })
          });
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.questions) && data.questions.length > 0) {
              setTriviaQuestions(data.questions);
              setCurrentTriviaIndex(0);
              setTriviaScore(0);
              setTriviaAnswered(false);
              setTriviaCorrect(null);
              setTriviaSetupComplete(true);
              setVoiceMessage('🎈 Loaded kid-friendly questions!');
              speakMessage("Let's play with some easy questions!");
              return;
            }
          }
        } catch {}
        // Local kid math fallback (10 questions)
        const localKid = generateLocalKidMathQuestions();
        setTriviaQuestions(localKid);
        setCurrentTriviaIndex(0);
        setTriviaScore(0);
        setTriviaAnswered(false);
        setTriviaCorrect(null);
        setTriviaSetupComplete(true);
        setVoiceMessage('🎈 Using local kid-friendly questions!');
        speakMessage("Let's play with some easy questions!");
        return;
      }

      // 1) Try OpenTDB first for real questions (age-mapped difficulty)
      try {
        const realQuestions = await fetchOpenTriviaBySubjectAndAge(userSubject, userAge);
        if (realQuestions && realQuestions.length) {
          setTriviaQuestions(realQuestions);
          setCurrentTriviaIndex(0);
          setTriviaScore(0);
          setTriviaAnswered(false);
          setTriviaCorrect(null);
          setTriviaSetupComplete(true);
          setVoiceMessage(`📚 Loaded real ${userSubject} questions for age ${userAge}!`);
          speakMessage("Loaded real questions for you. Let's start!");
          return;
        }
      } catch {}

      // 2) If OpenTDB didn't return, try server endpoint (kid mode or Gemini/OpenTDB server)
      const response = await fetch('/api/gemini-trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: userAge, subject: userSubject, difficulty: triviaDifficulty })
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setTriviaQuestions(data.questions);
          setCurrentTriviaIndex(0);
          setTriviaScore(0);
          setTriviaAnswered(false);
          setTriviaCorrect(null);
          setTriviaSetupComplete(true);
          setVoiceMessage(`🎯 Loaded ${data.questions.length} questions!`);
          speakMessage(`Loaded ${data.questions.length} questions. Let's start!`);
          return;
        }
      }

      // 3) Final fallback local samples (should rarely hit)
      const fallbackQuestions = generateFallbackQuestions();
      setTriviaQuestions(fallbackQuestions);
      setCurrentTriviaIndex(0);
      setTriviaScore(0);
      setTriviaAnswered(false);
      setTriviaCorrect(null);
      setTriviaSetupComplete(true);
      setVoiceMessage(`🎯 Using fallback ${userSubject} questions for age ${userAge}!`);
      speakMessage("I'm using some questions I prepared for you. Let's start!");
    } finally {
      setTriviaLoading(false);
    }
  };

  // Local kid-math generator (10 simple Qs)
  const generateLocalKidMathQuestions = () => {
    const qs: Array<{ question: string; correct_answer: string; incorrect_answers: string[] }> = [];
    for (let i = 0; i < 10; i++) {
      const isAdd = Math.random() < 0.7;
      let a = Math.floor(Math.random() * 6);
      let b = Math.floor(Math.random() * 6);
      if (!isAdd && b > a) [a, b] = [b, a];
      const correct = isAdd ? a + b : a - b;
      const q = isAdd ? `What is ${a} + ${b}?` : `What is ${a} - ${b}?`;
      const wrongs = new Set<number>();
      while (wrongs.size < 3) {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const val = Math.max(0, correct + delta * (1 + Math.floor(Math.random() * 2)));
        if (val !== correct && val <= 10) wrongs.add(val);
      }
      qs.push({ question: q, correct_answer: String(correct), incorrect_answers: Array.from(wrongs).map(String) });
    }
    return qs;
  };

  // Map spoken subject to Open Trivia DB category id
  const subjectToCategoryId = (subjectRaw: string): number | null => {
    const subject = subjectRaw.toLowerCase();
    const map: Record<string, number> = {
      general: 9,
      'general knowledge': 9,
      books: 10,
      literature: 10,
      english: 10,
      film: 11,
      movies: 11,
      music: 12,
      television: 14,
      tv: 14,
      'video games': 15,
      games: 15,
      science: 17,
      nature: 17,
      space: 17,
      animals: 27,
      computers: 18,
      technology: 18,
      maths: 19,
      math: 19,
      mathematics: 19,
      mythology: 20,
      sports: 21,
      geography: 22,
      history: 23,
      politics: 24,
      art: 25,
      vehicles: 28,
      comics: 29,
      gadgets: 30,
      cartoons: 32,
      animation: 32
    };
    // Try exact
    if (map[subject] !== undefined) return map[subject];
    // Try partial match over keys
    const key = Object.keys(map).find(k => subject.includes(k));
    return key ? map[key] : 9; // default to General Knowledge
  };

  const difficultyFromAge = (age: number): 'easy' | 'medium' | 'hard' => {
    if (age <= 10) return 'easy';
    if (age <= 16) return 'medium';
    return 'hard';
  };

  const decodeHtml = (text: string): string => {
    if (!text) return text;
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&eacute;/g, 'é')
      .replace(/&uuml;/g, 'ü')
      .replace(/&ouml;/g, 'ö')
      .replace(/&auml;/g, 'ä');
  };

  const fetchOpenTriviaBySubjectAndAge = async (subject: string, age: number) => {
    const categoryId = subjectToCategoryId(subject);
    const diff = difficultyFromAge(age);
    const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${diff}&type=multiple`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.response_code !== 0 || !Array.isArray(data.results)) {
      throw new Error('OpenTDB failed');
    }
    // Normalize and decode entities
    return data.results.map((q: any) => ({
      question: decodeHtml(q.question),
      correct_answer: decodeHtml(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map((a: string) => decodeHtml(a))
    }));
  };

  const generateFallbackQuestions = () => {
    // Generate sample questions based on age and subject
    const questions: Array<{ question: string; correct_answer: string; incorrect_answers: string[] }> = [];
    const age = userAge ?? 12;
    const difficulty = age < 12 ? 'easy' : age < 18 ? 'medium' : 'hard';
    
    for (let i = 0; i < 5; i++) {
      questions.push({
        question: `Sample ${userSubject} question ${i + 1} for ${difficulty} level?`,
        correct_answer: `Correct answer ${i + 1}`,
        incorrect_answers: [`Wrong answer ${i + 1}a`, `Wrong answer ${i + 1}b`, `Wrong answer ${i + 1}c`]
      });
    }
    
    return questions;
  };

  const resetTriviaSetup = () => {
    setUserAge(null);
    setUserSubject('');
    setTriviaSetupComplete(false);
    setVoiceMessage('');
    resetTrivia();
  };

  const renderTictactoeSquare = (i: number) => {
    const isDisabled = tictactoeBoard[i] !== null || tictactoeWinner !== null || aiThinking;
    const isAIThinking = aiThinking && tictactoeBoard[i] === null;
    
  return (
      <button
        className={`w-20 h-20 border-2 border-accent text-3xl font-bold transition-all duration-200 ${
          isDisabled 
            ? 'cursor-not-allowed' 
            : 'cursor-pointer hover:bg-gray-800 active:bg-gray-700'
        } ${
          tictactoeBoard[i] === 'X' 
            ? 'bg-accent-light text-accent border-accent' 
            : tictactoeBoard[i] === 'O' 
            ? 'bg-red-900 text-red-300 border-red-600'
            : isAIThinking
            ? 'bg-yellow-900 border-yellow-600 animate-pulse'
            : 'bg-dark-card'
        }`}
        onClick={() => handleTictactoeClick(i)}
        disabled={isDisabled}
        title={isAIThinking ? 'AI is thinking...' : tictactoeBoard[i] || `Click to place ${tictactoeXIsNext ? 'X' : 'O'}`}
      >
        {isAIThinking ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          tictactoeBoard[i]
        )}
      </button>
    );
  };

  // Analyze the center of the camera feed for color
  const analyzeColor = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isRoundActive || gameMode !== 'colors') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get center pixel color
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const imageData = ctx.getImageData(centerX, centerY, 1, 1);
    const [r, g, b] = imageData.data;

    // Find the closest matching color from our color list
    let bestMatch = colors[0];
    let bestSimilarity = 0;

    colors.forEach(color => {
      const similarity = calculateColorSimilarity([r, g, b], color.rgb);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = color;
      }
    });

    setDetectedColor(bestMatch.name);
    setDetectionConfidence(bestSimilarity);

    // Check if we found the target color or a related color (lower threshold)
    if (isRelatedColor(bestMatch.name, targetColor.name) && bestSimilarity > 40) {
      setScore(score + 1);
      const isExact = bestMatch.name === targetColor.name;
      setMessage(`🎉 Found ${isExact ? targetColor.name : `${bestMatch.name} (related to ${targetColor.name})`}! Great job!`);
      setIsCorrect(true);
      setIsRoundActive(false);
      
      // Start countdown for next round
      setTimeout(() => {
        generateNewGame();
      }, 3000); // 3 second delay between rounds
    }
  }, [targetColor, score, isRoundActive, gameMode]);

  const generateNewGame = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomColor);
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(true);
    
    // Speak the new color
    speakColor(randomColor.name);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setMessage('Camera started! Point it at the target color or related colors.');
      }
    } catch (err) {
      setMessage('Error accessing camera. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setMessage('');
  };

  // Start color analysis when camera is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCameraActive && isRoundActive && gameMode === 'colors') {
      interval = setInterval(analyzeColor, 100); // Analyze every 100ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraActive, analyzeColor, isRoundActive, gameMode]);

  // Auto-start camera when component mounts
  useEffect(() => {
    if (gameMode === 'colors') {
      generateNewGame();
      // Auto-start camera after a short delay
      const timer = setTimeout(() => {
        startCamera();
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    }
  }, [gameMode]);

  // Sudoku timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sudokuTimerActive && gameMode === 'sudoku') {
      interval = setInterval(() => {
        setSudokuTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sudokuTimerActive, gameMode]);

  // Initialize Sudoku board when component mounts
  useEffect(() => {
    if (gameMode === 'sudoku' && sudokuBoard.length === 0) {
      generateSudokuPuzzle(sudokuDifficulty);
    }
  }, [gameMode, sudokuBoard.length, sudokuDifficulty]);

  // Initialize flags data when flags game is first accessed
  useEffect(() => {
    if (gameMode === 'flags' && flagCountries.length === 0) {
      fetchFlagsData();
    }
  }, [gameMode, flagCountries.length]);

  // Initialize trivia questions when trivia game is first accessed
  useEffect(() => {
    if (gameMode === 'trivia' && triviaQuestions.length === 0 && !triviaLoading) {
      fetchTriviaQuestions(triviaCategory, triviaDifficulty);
    }
  }, [gameMode, triviaQuestions.length, triviaLoading, triviaCategory, triviaDifficulty]);

  // Click the Dot countdown timer
  useEffect(() => {
    if (gameMode !== 'clickdot') return;
    if (!dotIsRunning) return;
    if (dotTimeLeft <= 0) {
      setDotIsRunning(false);
      if (dotScore > dotBestScore) setDotBestScore(dotScore);
      setMessage('⏱️ Time up!');
      return;
    }
    const t = setTimeout(() => setDotTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [gameMode, dotIsRunning, dotTimeLeft, dotScore, dotBestScore]);

  // Switch game mode
  const switchToColors = () => {
    setGameMode('colors');
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(true);
    generateNewGame();
    setTimeout(() => {
      startCamera();
    }, 1000);
  };

  const switchToTictactoe = () => {
    setGameMode('tictactoe');
    stopCamera();
    resetTictactoe();
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(false);
  };

  const switchToSudoku = () => {
    setGameMode('sudoku');
    stopCamera();
    resetSudoku();
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(false);
    generateSudokuPuzzle(sudokuDifficulty);
  };

  const switchToTrivia = () => {
    setGameMode('trivia');
    stopCamera();
    resetTrivia();
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(false);
    fetchTriviaQuestions(triviaCategory, triviaDifficulty);
  };

  // Flags helpers
  const fetchFlagsData = async () => {
    setFlagLoading(true);
    try {
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,region');
      const data = await res.json();
      const countries = (Array.isArray(data) ? data : []).map((c: any) => ({
        name: c?.name?.common as string,
        code: c?.cca2 as string,
        flag: c?.flags?.svg || c?.flags?.png,
        region: c?.region || 'Other'
      })).filter((c: any) => c.name && c.flag);
      setFlagCountries(countries);
      buildNextFlagQuestion(countries);
    } catch {
      setMessage('Failed to load flags. Check your internet.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setFlagLoading(false);
    }
  };

  const EASY_COUNTRIES = new Set([
    'United States','India','China','Japan','Brazil','Canada','France','Germany','Italy','Spain','United Kingdom','Russia','Australia','Mexico','South Africa','Argentina','Saudi Arabia','Turkey','Egypt','Indonesia','Pakistan','Bangladesh','Nigeria','Kenya','Norway','Sweden','Finland','Denmark','Netherlands','Belgium','Portugal','Poland','Greece','Ireland','New Zealand','South Korea','Israel','United Arab Emirates','Qatar','Singapore','Thailand','Vietnam','Philippines','Colombia','Peru','Chile','Venezuela','Morocco','Algeria','Ethiopia'
  ]);

  const getFlagPool = (countriesSrc?: Array<{ name: string; flag: string; code: string; region: string }>) => {
    const base = (countriesSrc || flagCountries).filter(c => c && c.name && c.flag);
    if (flagDifficulty === 'easy') {
      const pool = base.filter(c => EASY_COUNTRIES.has(c.name));
      return pool.length >= 4 ? pool : base; // fallback if too small
    }
    return base; // medium/hard use all
  };

  const buildNextFlagQuestion = (countriesSrc?: Array<{ name: string; flag: string; code: string; region: string }>) => {
    const pool = getFlagPool(countriesSrc);
    if (pool.length < 4) return;
    // pick correct
    const correctIdx = Math.floor(Math.random() * pool.length);
    const correct = pool[correctIdx];

    // distractors
    let distractorPool = pool.filter((c) => c.name !== correct.name);
    if (flagDifficulty === 'hard') {
      const sameRegion = distractorPool.filter(c => c.region && c.region === correct.region);
      if (sameRegion.length >= 3) distractorPool = sameRegion;
    }

    const distractors: string[] = [];
    while (distractors.length < 3 && distractorPool.length) {
      const idx = Math.floor(Math.random() * distractorPool.length);
      const pick = distractorPool.splice(idx, 1)[0].name;
      if (!distractors.includes(pick)) distractors.push(pick);
    }
    // fallback if less than 3
    while (distractors.length < 3) {
      const rnd = pool[Math.floor(Math.random() * pool.length)].name;
      if (rnd !== correct.name && !distractors.includes(rnd)) distractors.push(rnd);
    }

    const options = [...distractors, correct.name].sort(() => Math.random() - 0.5);
    setFlagQuestion({ flag: correct.flag, correct: correct.name, options });
    setFlagAnswered(false);
    setFlagCorrect(null);
  };

  const handleFlagAnswer = (choice: string) => {
    if (!flagQuestion || flagAnswered) return;
    const isRight = choice === flagQuestion.correct;
    setFlagAnswered(true);
    setFlagCorrect(isRight);
    if (isRight) setFlagScore(prev => prev + 1);
    // next question after delay
    setTimeout(() => {
      setFlagQuestionIndex(prev => prev + 1);
      buildNextFlagQuestion();
    }, 1500);
  };

  const switchToFlags = () => {
    setGameMode('flags');
    stopCamera();
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(false);
    setFlagScore(0);
    setFlagQuestionIndex(0);
    if (!flagCountries.length) fetchFlagsData(); else buildNextFlagQuestion();
  };

  const switchToPatterns = () => {
    setGameMode('patterns');
    stopCamera();
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(false);
    setPatternSequence([]);
    setPatternUserIndex(0);
    setPatternRound(0);
    setPatternScore(0);
  };

  const switchToClickDot = () => {
    setGameMode('clickdot');
    stopCamera();
    setMessage('');
    setIsCorrect(null);
    setDetectedColor('');
    setDetectionConfidence(0);
    setIsRoundActive(false);
    setDotIsRunning(false);
  };

  const placeDotRandomly = () => {
    const container = dotContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const maxX = Math.max(0, rect.width - dotDiameter);
    const maxY = Math.max(0, rect.height - dotDiameter);
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    setDotPosition({ x, y });
  };

  const startDotGame = () => {
    setDotScore(0);
    setDotTimeLeft(30);
    setDotDiameter(48);
    setDotIsRunning(true);
    setMessage('');
    setTimeout(() => {
      placeDotRandomly();
      setDotVisible(true);
      scheduleDotTimers();
    }, 0);
  };

  const handleDotClick = () => {
    if (!dotIsRunning) return;
    setDotScore((prev) => prev + 1);
    setDotDiameter((prev) => Math.max(20, prev - 2));
    placeDotRandomly();
    setDotVisible(true);
    scheduleDotTimers();
  };

  useEffect(() => {
    // Clear timers when leaving the mode or stopping the game
    if (gameMode !== 'clickdot' || !dotIsRunning) {
      clearDotTimers();
      return;
    }
  }, [gameMode, dotIsRunning]);

  useEffect(() => {
    // Reschedule with new difficulty interval
    if (gameMode === 'clickdot' && dotIsRunning) {
      scheduleDotTimers();
    }
  }, [dotDifficulty]);

  // (duplicate Pattern Memory functions removed)

  if (gameMode === 'tictactoe') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/80 transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">⭕ Tic Tac Toe {isAIGame ? 'vs AI' : '2 Players'}</h1>
            
            {/* Game Mode Toggle */}
            <div className="mb-4">
              <div className="inline-flex bg-dark-card rounded-lg p-1 shadow-md">
                <button
                  onClick={() => { if (!isAIGame) toggleGameMode(); }}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    isAIGame 
                      ? 'bg-accent text-white shadow-md' 
                      : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                  }`}
                >
                  🤖 vs AI
                </button>
                <button
                  onClick={() => { if (isAIGame) toggleGameMode(); }}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !isAIGame 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                      : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                  }`}
                >
                  👥 2 Players
                </button>
              </div>
            </div>

            {/* AI Difficulty Settings */}
            {isAIGame && (
              <div className="mb-6">
                <p className="text-sm text-text-secondary mb-3 font-medium">🤖 AI Difficulty Level:</p>
                <div className="flex justify-center space-x-3">
                  {([
                    { level: 'easy', emoji: '😊', desc: 'Random moves', color: 'green' },
                    { level: 'medium', emoji: '🤔', desc: 'Smart + random', color: 'yellow' },
                    { level: 'hard', emoji: '😈', desc: 'Always smart', color: 'red' }
                  ] as const).map(({ level, emoji, desc, color }) => (
                    <button
                      key={level}
                      onClick={() => changeDifficulty(level)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        aiDifficulty === level
                          ? `bg-${color}-600 text-white shadow-lg ring-2 ring-${color}-400`
                          : `bg-dark-card text-text-secondary hover:bg-gray-700 border-2 border-${color}-600`
                      }`}
                      title={desc}
                    >
                      <div className="text-lg mb-1">{emoji}</div>
                      <div className="font-bold">{level.charAt(0).toUpperCase() + level.slice(1)}</div>
                      <div className="text-xs opacity-75">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 mb-4">
              <div className="text-lg">
                <span className="font-bold text-accent">You (X): {tictactoeScore.X}</span>
              </div>
              <div className="text-lg">
                <span className="font-bold text-red-400">
                  {isAIGame ? 'AI (O)' : 'Player 2 (O)'}: {tictactoeScore.O}
                </span>
              </div>
            </div>

            <p className="text-lg text-text-secondary mb-4">
              {tictactoeWinner 
                ? tictactoeWinner === 'Draw' 
                  ? '🤝 It\'s a Draw!' 
                  : `🎉 ${tictactoeWinner === 'X' ? 'You won!' : isAIGame ? 'AI won!' : 'Player 2 won!'}`
                : aiThinking 
                  ? '🤔 AI is thinking...'
                  : isAIGame 
                    ? `Your turn (X)`
                    : `${tictactoeXIsNext ? 'Player 1' : 'Player 2'}\'s turn (${tictactoeXIsNext ? 'X' : 'O'})`
              }
            </p>

            {/* Message display for difficulty changes and other feedback */}
            {message && (
              <div className="mb-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
                {message}
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-1 bg-accent p-2 rounded-lg">
              {renderTictactoeSquare(0)}
              {renderTictactoeSquare(1)}
              {renderTictactoeSquare(2)}
              {renderTictactoeSquare(3)}
              {renderTictactoeSquare(4)}
              {renderTictactoeSquare(5)}
              {renderTictactoeSquare(6)}
              {renderTictactoeSquare(7)}
              {renderTictactoeSquare(8)}
            </div>
          </div>

          {/* Game Controls */}
          <div className="text-center space-x-4">
            <button
              onClick={resetTictactoe}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🔄 New Game
            </button>
            <button
              onClick={() => setGameMode('menu')}
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. You play as X (Blue)</li>
              <li>2. {isAIGame ? 'AI plays as O (Red)' : 'Player 2 plays as O (Red)'}</li>
              <li>3. Get 3 in a row to win!</li>
              <li>4. {isAIGame ? 'Choose AI difficulty level above' : 'Take turns with your friend'}</li>
              <li>5. Click "New Game" to start over</li>
              <li>6. Switch between AI and 2-player modes</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'sudoku') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/80 transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">🔢 Sudoku Puzzle</h1>
            
            {/* Difficulty Selection */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-3 font-medium">🎯 Difficulty Level:</p>
              <div className="flex justify-center space-x-3">
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => changeSudokuDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      sudokuDifficulty === difficulty
                        ? 'bg-accent text-white shadow-lg'
                        : 'bg-dark-card text-text-secondary hover:bg-gray-700 border-2 border-accent'
                    }`}
                  >
                    {difficulty === 'easy' && '😊 Easy'}
                    {difficulty === 'medium' && '🤔 Medium'}
                    {difficulty === 'hard' && '😈 Hard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer and Status */}
            <div className="mb-4">
              <div className="text-lg text-text-secondary mb-2">
                ⏱️ Time: {Math.floor(sudokuTimer / 60)}:{(sudokuTimer % 60).toString().padStart(2, '0')}
              </div>
              {sudokuCompleted && (
                <div className="text-accent font-bold text-lg">🎉 Puzzle Completed!</div>
              )}
            </div>

            {/* Message display */}
            {message && (
              <div className="mb-4 p-3 bg-accent/20 text-accent border border-accent rounded-lg">
                {message}
              </div>
            )}
          </div>

          {/* Sudoku Board */}
          <div className="flex justify-center mb-8">
            <div className="bg-dark-card p-4 rounded-lg shadow-lg border border-accent">
              <div className="grid grid-cols-9 gap-px bg-accent">
                {sudokuBoard.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isSelected = sudokuSelectedCell?.[0] === rowIndex && sudokuSelectedCell?.[1] === colIndex;
                    const isError = sudokuErrors.has(`${rowIndex}-${colIndex}`);
                    const isOriginal = sudokuBoard[rowIndex][colIndex] !== null && sudokuSolution[rowIndex][colIndex] === sudokuBoard[rowIndex][colIndex];
                    
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSudokuCellClick(rowIndex, colIndex)}
                        className={`w-12 h-12 border border-accent text-lg font-bold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-accent text-white border-accent' 
                            : isError 
                            ? 'bg-red-900 text-red-300' 
                            : isOriginal 
                            ? 'bg-gray-700 text-white font-bold' 
                            : 'bg-dark-card text-white hover:bg-gray-800'
                        } ${
                          (rowIndex + 1) % 3 === 0 ? 'border-b-2 border-accent' : ''
                        } ${
                          (colIndex + 1) % 3 === 0 ? 'border-r-2 border-accent' : ''
                        }`}
                        disabled={isOriginal}
                      >
                        {cell || ''}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Number Input */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSudokuNumberInput(num)}
                  disabled={!sudokuSelectedCell}
                  className="w-12 h-12 bg-accent text-white text-xl font-bold rounded-lg hover:bg-accent/80 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors border-2 border-accent !border-accent disabled:!border-accent"
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleSudokuNumberInput(0)}
              disabled={!sudokuSelectedCell}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              Clear Cell
            </button>
          </div>

          {/* Game Controls */}
          <div className="text-center space-x-4">
            <button
              onClick={() => generateSudokuPuzzle(sudokuDifficulty)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🔄 New Puzzle
            </button>
            <button
              onClick={() => setGameMode('menu')}
              className="bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play Sudoku:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. Fill each row, column, and 3x3 box with numbers 1-9</li>
              <li>2. No number can repeat in the same row, column, or box</li>
              <li>3. Click a cell to select it, then click a number to fill it</li>
              <li>4. Gray cells are original numbers and cannot be changed</li>
              <li>5. Red cells indicate errors</li>
              <li>6. Complete the puzzle to win!</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'trivia') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/80 transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">🧠 AI-Powered Trivia Challenge</h1>
            
            {!triviaSetupComplete ? (
              /* Voice Setup Interface */
              <div className="mb-8">
                <div className="bg-dark-card p-8 rounded-lg shadow-lg max-w-2xl mx-auto border border-accent">
                  <h2 className="text-2xl font-bold text-accent mb-6">🎤 Let's Get to Know You!</h2>
                  
                  {/* Age Input */}
                  {!userAge && (
                    <div className="mb-6">
                      <p className="text-lg text-text-secondary mb-4">
                        First, tell me your age so I can create perfect questions for you!
                      </p>
                      <button
                        onClick={startVoiceRecognition}
                        disabled={isListening}
                        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                      >
                        {isListening ? '🎤 Listening...' : '🎤 Tell Me Your Age'}
                      </button>
                      <p className="text-sm text-text-muted mt-2">
                        Say something like "I am 12 years old" or "I'm 25"
                      </p>
                    </div>
                  )}

                  {/* Subject Input */}
                  {userAge && !userSubject && (
                    <div className="mb-6">
                      <p className="text-lg text-text-secondary mb-4">
                        Great! You're {userAge} years old. Now what subject would you like to learn about?
                      </p>
                      <button
                        onClick={startVoiceRecognition}
                        disabled={isListening}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                      >
                        {isListening ? '🎤 Listening...' : '🎤 Tell Me Your Subject'}
                      </button>
                      <p className="text-sm text-text-muted mt-2">
                        Say subjects like "science", "history", "math", "animals", "space", etc.
                      </p>
                    </div>
                  )}

                  {/* Voice Message Display */}
                  {voiceMessage && (
                    <div className="mt-6 p-4 bg-accent-light border border-accent rounded-lg">
                      <p className="text-accent font-medium">{voiceMessage}</p>
                    </div>
                  )}

                  {/* Manual Input Fallback */}
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <p className="text-sm text-text-secondary mb-3">Or type manually:</p>
                    <div className="flex space-x-4 justify-center">
                      <input
                        type="number"
                        placeholder="Age"
                        value={userAge || ''}
                        onChange={(e) => setUserAge(parseInt(e.target.value) || null)}
                        className="px-3 py-2 border border-gray-600 rounded-lg w-20 text-center bg-gray-700 text-white"
                        min="5"
                        max="100"
                      />
                      <input
                        type="text"
                        placeholder="Subject (e.g., science)"
                        value={userSubject}
                        onChange={(e) => setUserSubject(e.target.value)}
                        className="px-3 py-2 border border-gray-600 rounded-lg w-40 bg-gray-700 text-white"
                      />
                      <button
                        onClick={generateGeminiTrivia}
                        disabled={!userAge || !userSubject}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                      >
                        Generate Questions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Trivia Game Interface */
              <>
                {/* Game Settings */}
                <div className="mb-6">
                  <div className="bg-dark-card p-4 rounded-lg shadow-lg inline-block border border-accent">
                    <div className="text-center">
                      <p className="text-lg text-accent mb-2">
                        🎯 <span className="font-bold">{userSubject.charAt(0).toUpperCase() + userSubject.slice(1)}</span> Trivia for Age <span className="font-bold">{userAge}</span>
                      </p>
                      <button
                        onClick={resetTriviaSetup}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        🔄 Change Preferences
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score and Progress */}
                <div className="mb-4">
                  <div className="text-lg text-text-secondary mb-2">
                    📊 Score: {triviaScore} | Question: {currentTriviaIndex + 1}/{triviaQuestions.length}
                  </div>
                </div>

                {/* Message display */}
                {message && (
                  <div className="mb-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
                    {message}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Trivia Question */}
          {triviaSetupComplete && triviaQuestions.length > 0 && (
            <div className="bg-dark-card p-8 rounded-lg shadow-lg mb-8 border border-accent">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-accent mb-4">
                  Question {currentTriviaIndex + 1}:
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {triviaQuestions[currentTriviaIndex].question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  triviaQuestions[currentTriviaIndex].correct_answer,
                  ...triviaQuestions[currentTriviaIndex].incorrect_answers
                ].map((answer) => {
                  const isCorrect = answer === triviaQuestions[currentTriviaIndex].correct_answer;
                  const isSelected = triviaAnswered && answer === triviaQuestions[currentTriviaIndex].correct_answer;
                  
                  return (
                    <button
                      key={answer}
                      onClick={() => handleTriviaAnswer(answer)}
                      disabled={triviaAnswered}
                      className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        triviaAnswered
                          ? isCorrect
                            ? 'bg-green-900 border-green-500 text-green-300'
                            : 'bg-gray-700 border-gray-500 text-gray-300'
                          : 'bg-gray-800 border-gray-600 text-text-secondary hover:border-accent hover:bg-gray-700'
                      }`}
                    >
                      {answer}
                      {triviaAnswered && (
                        <span className="ml-2">
                          {isCorrect ? '✅' : '❌'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {triviaAnswered && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
                  triviaCorrect 
                    ? 'bg-green-900 text-green-300 border border-green-600' 
                    : 'bg-red-900 text-red-300 border border-red-600'
                }`}>
                  {triviaCorrect ? '🎉 Correct!' : '❌ Wrong!'} The correct answer is: {triviaQuestions[currentTriviaIndex].correct_answer}
                </div>
              )}
            </div>
          )}

          {/* Game Controls */}
          <div className="text-center space-x-4">
            {triviaSetupComplete && (
              <button
                onClick={generateGeminiTrivia}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                🔄 New Game
              </button>
            )}
            <button
              onClick={() => setGameMode('menu')}
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play AI Trivia:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. 🎤 Tell me your age using voice</li>
              <li>2. 🎤 Tell me what subject you want to learn</li>
              <li>3. 🤖 AI generates personalized questions for your age</li>
              <li>4. 📝 Answer the questions and see your score</li>
              <li>5. 🔄 Generate new questions anytime</li>
              <li>6. 🎯 Questions are tailored to your age and interests!</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'flags') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent-light text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">🚩 Guess the Country by Flag</h1>
            <p className="text-lg text-text-secondary mb-2">Score: {flagScore} | Question: {flagQuestionIndex + 1}</p>
            
            {/* Difficulty Selection */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-3 font-medium">🎯 Difficulty Level:</p>
              <div className="flex justify-center space-x-3">
                {(['easy','medium','hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { setFlagDifficulty(lvl); buildNextFlagQuestion(); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      flagDifficulty === lvl
                        ? 'bg-accent text-black shadow-lg'
                        : 'bg-dark-card text-text-secondary hover:bg-gray-700 border-2 border-accent'
                    }`}
                  >
                    {lvl==='easy'?'😊 Easy':lvl==='medium'?'🤔 Medium':'😈 Hard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Message display */}
            {message && (
              <div className="mb-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
                {message}
              </div>
            )}
          </div>

          <div className="flex justify-center mb-8">
            {flagLoading || !flagQuestion ? (
              <div className="text-text-secondary">Loading flags...</div>
            ) : (
              <div className="bg-dark-card p-6 rounded-lg shadow-lg w-full md:w-2/3 border border-accent">
                <div className="flex justify-center mb-6">
                  <img src={flagQuestion.flag} alt="Flag" className="w-64 h-40 object-contain border-2 border-accent rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flagQuestion.options.map((opt, idx) => {
                    const isCorrect = flagAnswered && opt === flagQuestion.correct;
                    const isWrong = flagAnswered && !isCorrect;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleFlagAnswer(opt)}
                        disabled={flagAnswered}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          flagAnswered 
                            ? (isCorrect 
                                ? 'bg-green-900 border-green-500 text-green-300' 
                                : 'bg-gray-700 border-gray-500 text-gray-300') 
                            : 'bg-gray-800 border-gray-600 text-text-secondary hover:border-accent hover:bg-gray-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {flagAnswered && (
                  <div className={`mt-6 p-3 rounded text-center ${
                    flagCorrect 
                      ? 'bg-green-900 text-green-300 border border-green-600' 
                      : 'bg-red-900 text-red-300 border border-red-600'
                  }`}>
                    {flagCorrect ? '🎉 Correct!' : `❌ Wrong! Correct answer: ${flagQuestion.correct}`}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center space-x-4">
            <button 
              onClick={() => setGameMode('menu')}
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play Guess the Flag:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. Look at the flag image above</li>
              <li>2. Choose the correct country name from the options</li>
              <li>3. Easy mode: Common countries only</li>
              <li>4. Hard mode: Countries from same region</li>
              <li>5. Your score increases with each correct answer</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'patterns') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent-light text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">🧩 Pattern Memory</h1>
            <p className="text-lg text-text-secondary mb-2">Round: {patternRound} | Score: {patternScore}</p>
            
            {/* Difficulty Selection */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-3 font-medium">🎯 Difficulty Level:</p>
              <div className="flex justify-center space-x-3">
                {(['easy','medium','hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setPatternDifficulty(lvl)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      patternDifficulty === lvl
                        ? 'bg-accent text-black shadow-lg'
                        : 'bg-dark-card text-text-secondary hover:bg-gray-700 border-2 border-accent'
                    }`}
                  >
                    {lvl==='easy'?'😊 Easy':lvl==='medium'?'🤔 Medium':'😈 Hard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Message display */}
            {message && (
              <div className="mb-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
                {message}
              </div>
            )}
          </div>

          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-2 gap-4">
              {patternPads.map((pad) => (
                <button
                  key={pad.id}
                  onClick={() => handlePatternPadClick(pad.id)}
                  className="w-36 h-36 rounded-lg shadow border-2 transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: patternActivePad === pad.id ? pad.color : '#1f2937',
                    borderColor: pad.color
                  }}
                >
                  <span className="font-bold" style={{ color: patternActivePad === pad.id ? '#ffffff' : pad.color }}>{pad.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center space-x-4">
            <button 
              onClick={startPatternGame} 
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              ▶️ Start
            </button>
            <button 
              onClick={() => setGameMode('menu')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play Pattern Memory:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. Click Start to begin the game</li>
              <li>2. Watch the color sequence carefully</li>
              <li>3. Repeat the pattern by clicking colors in order</li>
              <li>4. The sequence gets longer each round</li>
              <li>5. Choose difficulty level above</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'clickdot') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent-light text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">🔴 Click the Dot</h1>
            <p className="text-lg text-text-secondary mb-2">Score: {dotScore} | Best: {dotBestScore} | Time: {dotTimeLeft}s</p>
            
            {/* Difficulty Selection */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-3 font-medium">🎯 Difficulty Level:</p>
              <div className="flex justify-center space-x-3">
                {(['easy','medium','hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDotDifficulty(lvl)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      dotDifficulty === lvl
                        ? 'bg-accent text-black shadow-lg'
                        : 'bg-dark-card text-text-secondary hover:bg-gray-700 border-2 border-accent'
                    }`}
                    disabled={dotIsRunning}
                    title={lvl==='easy'?'Dot disappears every 3s':lvl==='medium'?'Every 2s':'Every 1s'}
                  >
                    {lvl==='easy'?'😊 Easy':lvl==='medium'?'🤔 Medium':'😈 Hard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Message display */}
            {message && (
              <div className="mb-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
                {message}
              </div>
            )}
          </div>

          <div className="flex justify-center mb-8">
            <div
              ref={dotContainerRef}
              className="relative bg-dark-card w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-xl shadow-inner border-2 border-accent"
            >
              {dotIsRunning && dotVisible ? (
                <button
                  onClick={handleDotClick}
                  className="absolute rounded-full shadow-lg border-2 border-white"
                  style={{
                    left: `${dotPosition.x}px`,
                    top: `${dotPosition.y}px`,
                    width: `${dotDiameter}px`,
                    height: `${dotDiameter}px`,
                    backgroundColor: '#ef4444'
                  }}
                  aria-label="Click the dot"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🕹️</div>
                    <div>Press Start to play</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={startDotGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {dotIsRunning ? '🔄 Restart' : '▶️ Start'}
            </button>
            <button 
              onClick={() => setGameMode('menu')}
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play Click the Dot:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. Click Start to begin a 30-second round</li>
              <li>2. Click the red dot as fast as you can</li>
              <li>3. The dot gets smaller after each click</li>
              <li>4. Your best score is saved for this session</li>
              <li>5. Choose difficulty level above</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Robot Face SVG */}
          <div className="flex justify-center mb-8">
            <svg className="w-96 h-56 md:w-[500px] md:h-[300px]" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <rect width="1200" height="700" fill="black" />
              <g stroke="#08AFC0" strokeWidth="70" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* Eyes group shifted down to make the face more compact */}
                <g transform="translate(0,120)">
                  {/* Left eye: right-pointing chevron */}
                  <path d="M180 180 L360 120 L180 60" />
                  {/* Right eye: left-pointing chevron */}
                  <path d="M1020 180 L840 120 L1020 60" />
                </g>
                {/* Static mouth line */}
                <line 
                  x1="580" 
                  y1="500" 
                  x2="620" 
                  y2="500"
                  stroke="#08AFC0"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-accent mb-4">🎮 Game Hub</h1>
            <p className="text-xl text-text-secondary mb-2">Choose your game adventure!</p>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Camera Color Detection Game */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('colors')}>
              <div className="text-4xl mb-4 text-center">📷</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">Camera Color Detection</h3>
              <p className="text-text-secondary text-center mb-4">Use your camera to find colors in the real world!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">AI-Powered</span>
              </div>
            </div>

            {/* Tic Tac Toe */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('tictactoe')}>
              <div className="text-4xl mb-4 text-center">⭕</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">Tic Tac Toe</h3>
              <p className="text-text-secondary text-center mb-4">Classic game with AI opponent or play with friends!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">Strategy</span>
              </div>
            </div>

            {/* Sudoku */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('sudoku')}>
              <div className="text-4xl mb-4 text-center">🔢</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">Sudoku</h3>
              <p className="text-text-secondary text-center mb-4">Solve number puzzles with multiple difficulty levels!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">Logic</span>
              </div>
            </div>

            {/* Trivia */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('trivia')}>
              <div className="text-4xl mb-4 text-center">🧠</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">AI Trivia</h3>
              <p className="text-text-secondary text-center mb-4">Test your knowledge with AI-generated questions!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">Knowledge</span>
              </div>
            </div>

            {/* Flags */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('flags')}>
              <div className="text-4xl mb-4 text-center">🚩</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">Guess the Flag</h3>
              <p className="text-text-secondary text-center mb-4">Learn about countries through their flags!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">Geography</span>
              </div>
            </div>

            {/* Pattern Memory */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('patterns')}>
              <div className="text-4xl mb-4 text-center">🧩</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">Pattern Memory</h3>
              <p className="text-text-secondary text-center mb-4">Remember and repeat color patterns!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">Memory</span>
              </div>
            </div>

            {/* Click the Dot */}
            <div className="bg-dark-card rounded-xl p-6 hover:border-accent transition-all duration-300 cursor-pointer group" onClick={() => setGameMode('clickdot')}>
              <div className="text-4xl mb-4 text-center">🔴</div>
              <h3 className="text-xl font-bold text-accent mb-2 text-center">Click the Dot</h3>
              <p className="text-text-secondary text-center mb-4">Test your reflexes and speed!</p>
              <div className="text-center">
                <span className="inline-block bg-accent-light text-accent px-4 py-2 rounded-lg text-sm font-medium">Reflexes</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-text-muted text-sm">Built with Next.js and AI • Enjoy your gaming experience!</p>
          </div>
        </div>
      </div>
    );
  }

  // Camera Color Detection Game
  if (gameMode === 'colors') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setGameMode('menu')}
              className="absolute top-8 left-8 bg-accent-light text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
            >
              ← Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-accent mb-4">📷 Camera Color Detection Game</h1>
            <p className="text-lg text-text-secondary mb-2">
              Find this color: <span className="font-bold text-2xl" style={{ color: targetColor.hex }}>
                {targetColor.name}
              </span>
            </p>
            <p className="text-text-muted">Score: {score}</p>
            <p className="text-sm text-text-secondary mt-2">Related colors also count! 🎯</p>
            
            {!isRoundActive && (
              <div className="mt-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
                <p className="font-semibold">🎉 Round Complete!</p>
                <p>Next color will appear in a few seconds...</p>
              </div>
            )}
          </div>

          {message && (
            <div className={`text-center mb-6 p-4 rounded-lg ${
              isCorrect 
                ? 'bg-green-900 text-green-100 border border-green-700' 
                : 'bg-blue-900 text-blue-100 border border-blue-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center mb-8">
            {/* Camera Feed */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-80 h-60 bg-gray-800 rounded-lg border-4 border-accent shadow-lg"
              />
              {!isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center text-text-secondary">
                    <div className="text-4xl mb-2">📷</div>
                    <div>Starting camera...</div>
                  </div>
                </div>
              )}
              
              {/* Center target indicator */}
              {isCameraActive && isRoundActive && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 border-2 border-white rounded-full bg-transparent"></div>
                  <div className="w-4 h-4 border-2 border-red-500 rounded-full bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              )}

              {/* Round status overlay */}
              {!isRoundActive && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl mb-2">⏳</div>
                    <div className="font-semibold">Round Complete!</div>
                    <div className="text-sm">Next color coming soon...</div>
                  </div>
                </div>
              )}
            </div>

            {/* Color Analysis Panel */}
            <div className="bg-dark-card p-6 rounded-lg shadow-lg min-w-64">
              <h3 className="text-lg font-semibold mb-4 text-center text-accent">Color Analysis</h3>
              
              {isCameraActive ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-text-secondary">Detected Color:</p>
                    <p className="font-semibold text-lg text-white">{detectedColor || 'Analyzing...'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-text-secondary">Confidence:</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${detectionConfidence}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{detectionConfidence.toFixed(1)}%</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-text-secondary">Target Color:</p>
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-accent mx-auto mt-2"
                      style={{ backgroundColor: targetColor.hex }}
                    ></div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-text-secondary">Related Colors:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {targetColor.related.map((relatedColor, index) => {
                        const color = colors.find(c => c.name === relatedColor);
                        return (
                          <div 
                            key={index}
                            className="w-8 h-8 rounded border border-accent"
                            style={{ backgroundColor: color?.hex }}
                            title={relatedColor}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {!isRoundActive && (
                    <div className="text-center p-3 bg-accent-light border border-accent rounded">
                      <p className="text-sm text-accent">🎯 Round paused - next color coming soon!</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-text-secondary">
                  <div className="text-2xl mb-2">🎯</div>
                  <p>Camera starting automatically...</p>
                </div>
              )}
            </div>
          </div>

          {/* Hidden canvas for color analysis */}
          <canvas ref={canvasRef} className="hidden" />

          <div className="text-center space-x-4">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                🛑 Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                📷 Start Camera
              </button>
            )}
            
            <button
              onClick={generateNewGame}
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              disabled={!isRoundActive}
            >
              🎲 New Color
            </button>

            <button
              onClick={() => setGameMode('menu')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="mt-12 text-center text-text-secondary">
            <h2 className="text-xl font-semibold mb-4 text-accent">How to Play:</h2>
            <ol className="text-left max-w-md mx-auto space-y-2">
              <li>1. Camera starts automatically (allow permissions)</li>
              <li>2. Listen for the spoken color instruction</li>
              <li>3. Point camera at the target color or related colors</li>
              <li>4. Related colors also count as correct answers!</li>
              <li>5. Wait for the 3-second delay between rounds</li>
              <li>6. The center circle shows the detection area</li>
              <li>7. Lower accuracy threshold for easier gameplay</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-4">🔢 Sudoku Puzzle</h1>
          
          {/* Difficulty Selection */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary mb-3 font-medium">🎯 Difficulty Level:</p>
            <div className="flex justify-center space-x-3">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => changeSudokuDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sudokuDifficulty === difficulty
                      ? 'bg-accent text-black shadow-lg'
                      : 'bg-dark-card text-text-secondary hover:bg-gray-700 border-2 border-accent'
                  }`}
                >
                  {difficulty === 'easy' && '😊 Easy'}
                  {difficulty === 'medium' && '🤔 Medium'}
                  {difficulty === 'hard' && '😈 Hard'}
                </button>
              ))}
            </div>
          </div>

          {/* Timer and Status */}
          <div className="mb-4">
            <div className="text-lg text-text-secondary mb-2">
              ⏱️ Time: {Math.floor(sudokuTimer / 60)}:{(sudokuTimer % 60).toString().padStart(2, '0')}
            </div>
            {sudokuCompleted && (
              <div className="text-accent font-bold text-lg">🎉 Puzzle Completed!</div>
            )}
          </div>

          {/* Message display */}
          {message && (
            <div className="mb-4 p-3 bg-accent-light text-accent rounded-lg border border-accent">
              {message}
            </div>
          )}
        </div>

        {/* Sudoku Board */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-card p-4 rounded-lg shadow-lg border border-accent">
            <div className="grid grid-cols-9 gap-px bg-accent">
              {sudokuBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected = sudokuSelectedCell?.[0] === rowIndex && sudokuSelectedCell?.[1] === colIndex;
                  const isError = sudokuErrors.has(`${rowIndex}-${colIndex}`);
                  const isOriginal = sudokuBoard[rowIndex][colIndex] !== null && sudokuSolution[rowIndex][colIndex] === sudokuBoard[rowIndex][colIndex];
                  
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSudokuCellClick(rowIndex, colIndex)}
                                              className={`w-12 h-12 border border-accent text-lg font-bold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-accent-light border-accent text-black' 
                            : isError 
                            ? 'bg-red-900 text-red-300' 
                            : isOriginal 
                            ? 'bg-gray-700 text-white font-bold' 
                            : 'bg-dark-card text-white hover:bg-gray-800'
                        } ${
                          (rowIndex + 1) % 3 === 0 ? 'border-b-2 border-accent' : ''
                        } ${
                          (colIndex + 1) % 3 === 0 ? 'border-r-2 border-accent' : ''
                        }`}
                      disabled={isOriginal}
                    >
                      {cell || ''}
                    </button>
                  );
                })
              )}
      </div>
          </div>
        </div>

        {/* Number Input */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleSudokuNumberInput(num)}
                disabled={!sudokuSelectedCell}
                className="w-12 h-12 bg-accent text-black text-xl font-bold rounded-lg hover:bg-accent/80 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors border-2 border-accent !border-accent disabled:!border-accent"
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleSudokuNumberInput(0)}
            disabled={!sudokuSelectedCell}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            Clear Cell
          </button>
        </div>

        {/* Game Controls */}
        <div className="text-center space-x-4">
          <button
            onClick={() => generateSudokuPuzzle(sudokuDifficulty)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            🔄 New Puzzle
          </button>
                      <button
              onClick={() => setGameMode('menu')}
              className="bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🏠 Back to Menu
            </button>
        </div>

        <div className="mt-12 text-center text-text-secondary">
          <h2 className="text-xl font-semibold mb-4 text-accent">How to Play Sudoku:</h2>
          <ol className="text-left max-w-md mx-auto space-y-2">
            <li>1. Fill each row, column, and 3x3 box with numbers 1-9</li>
            <li>2. No number can repeat in the same row, column, or box</li>
            <li>3. Click a cell to select it, then click a number to fill it</li>
            <li>4. Gray cells are original numbers and cannot be changed</li>
            <li>5. Red cells indicate errors</li>
            <li>6. Complete the puzzle to win!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}


