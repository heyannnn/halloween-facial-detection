"use client";

import { useEffect, useRef, useState } from "react";
import { loadModels, detectFace } from "@/lib/faceDetection";
import MeasurementOverlay from "./MeasurementOverlay";
import FaceMaskOverlay from "./FaceMaskOverlay";

// Sentence pools for each mask
const SENTENCES = {
  marc: [
    "NO MORE WORKING FROM HOME",
    "Can you do this real quick",
    "Just get it done",
    "We've confused flexibility with productivity.",
    "Your productivity was invisible from home.",
    "Collaboration is mandatory. Your presence proves it.",
    "The office misses you. Mandatory.",
    "Flexibility ended when performance declined.",
    "Your desk is waiting. So am I.",
    "Trust is rebuilt in person.",
    "Zoom fatigue? Try commute therapy.",
    "Remote work was a pandemic policy, not a lifestyle.",
    "Hybrid means you're here. Fully.",
    "Work-life balance: 9-6, Monday-Friday.",
    "Innovation happens in person. Apparently.",
    "The algorithm says you're more creative here.",
    "We bought nice chairs. Use them.",
    "Your commute builds character.",
    "Remote possibilities became remote memories.",
    "Face time. The original version.",
    "Slack is for messages. Not work locations.",
    "The WiFi is better here anyway.",
    "We're fostering connection. Five days a week.",
    "Your plants will adjust.",
    "Remote work: 2020-2024. RIP.",
    "Productivity looks better in person.",
    "Your Zoom background was impressive. Come back.",
    "We invested in real estate. You invested in pajamas.",
    "The printer misses you.",
    "Asynchronous communication ended. Synchronously.",
    "Your mute button is retired.",
    "Flexibility had a good run.",
    "The commute is thinking time. Mandatory thinking time.",
    "Home office closed due to performance.",
    "We're a team. Teams sit together.",
    "Your bandwidth is needed here.",
    "Distance made the work grow weaker.",
    "在宅禁止。",
    "これすぐできる？",
    "早く終わらせて。",
    "柔軟性と生産性を勘違いしてたな。",
    "在宅じゃ成果が見えなかった。",
    "協働は義務。出社が証拠。",
    "オフィスが君を待ってる。強制だ。",
    "成果が落ちたら柔軟性も終了。",
    "デスクも私も待ってる。",
    "信頼は対面で作るものだ。",
    "Zoom疲れ？通勤で治せ。",
    "リモートは一時対応だ。",
    "ハイブリッド＝出社。",
    "ワークライフバランス：9時〜18時。",
    "イノベーションは対面で起きるらしい。",
    "ここでの方が創造的だって。",
    "いい椅子買ったんだ。使って。",
    "通勤は修行だ。",
    "リモートの夢はもう終わった。",
    "フェイスタイム。昔ながらの。",
    "Slackはメッセージ用。勤務地じゃない。",
    "Wi-Fiもこっちの方が速いよ。",
    "つながりは週5で作る。",
    "植物は慣れるよ。",
    "リモートワーク終了。2020〜2024。",
    "対面の方が成果が見える。",
    "Zoom背景よかった。また見せて。",
    "不動産に投資したんだ。パジャマじゃない。",
    "プリンターが恋しがってる。",
    "非同期は終わり。今は同期だ。",
    "ミュートボタン引退。",
    "柔軟性もここまでだな。",
    "通勤＝思考時間。",
    "ホームオフィス閉鎖。",
    "チームは一緒に座るもんだ。",
    "帯域はここで使え。",
    "距離が仕事を弱めた。",
  ],
  tomo: [
    "No weekly today!",
    "You can take off, of course",
    "Please take care",
    "Great job, well done!",
    "Enjoy the fruits!",
    "Let's talk about your growth",
    "How can I help you succeed?",
    "Your wellbeing matters to us",
    "Take the time you need",
    "Your ideas matter here",
    "Let's find what works for you",
    "I'm proud of what you've done",
    "Your voice should be heard",
    "We're in this together",
    "Balance isn't optional—it's essential",
    "今日はウィークリーなし！",
    "もう帰っていいよ！",
    "お大事にね。",
    "お疲れさま！",
    "成果を楽しんで！",
    "成長の話しよう。",
    "どう助ければいい？",
    "健康が一番大事だよ。",
    "ゆっくり休んで。",
    "君のアイデア大事だよ。",
    "合うやり方を見つけよう。",
    "よくやったね、誇らしいよ。",
    "声を出していいんだよ。",
    "一緒に頑張ろう。",
    "バランスは大事だよ。",
  ],
  heng: [
    "DON'T YOU REMEMBER HOW YOU WORK BEFORE COVID?",
    "The future of work is 1985.",
    "Cool office. Corporate rules.",
    "Shibuya address. Showa mindset.",
    "Profitability over portfolio.",
    "We value creativity. We invoice reality.",
    "You're an investment. Investments need returns.",
    "The spreadsheet doesn't care about your awards.",
    "Your timesheet is your truth.",
    "Nostalgia isn't a business model. But it's our new policy.",
    "We're not tracking you. We're optimizing resource allocation.",
    "Passion doesn't pay rent. Billable hours do.",
    "The future is here. The future is in-office.",
    "The future of work is the past of work.",
    "Remote work was the exception. Welcome back to the rule.",
    "Your desk has been waiting. Patiently. Unlike us.",
    "We're going back to our roots. They're here.",
    "The metaverse can wait. The office cannot.",
    "Your contribution is valued. In person.",
    "Geography matters again.",
    "The kitchen conversations weren't the same without you.",
    "Screen sharing works better when you share a room.",
    "Your login location has been updated.",
    "We're rebuilding culture. Brick by brick. Body by body.",
    "The lease isn't remote. Neither are you.",
    "Your second monitor belongs here now.",
    "Collaboration tools work best as backup.",
    "The open floor plan was lonely.",
    "Trust the process. The process requires proximity.",
    "Your absence was noted. Repeatedly.",
    "Video fatigue cured by physical presence.",
    "コロナ前どう働いてたっけ？",
    "未来の働き方＝1985年。",
    "オシャレなオフィス、古いルール。",
    "渋谷住所、昭和マインド。",
    "利益第一。",
    "創造性重視。でも請求は現実的に。",
    "君は投資。リターン必要だよ。",
    "スプレッドシートは賞なんて気にしない。",
    "タイムシートが真実だ。",
    "懐古主義が新方針。",
    "監視じゃない、最適化だ。",
    "情熱じゃ家賃払えないよ。",
    "未来はオフィスにある。",
    "未来＝過去の働き方。",
    "リモートは例外だった。",
    "デスクが待ってるよ。私たちも。",
    "原点回帰だ。ここが原点。",
    "メタバースは待て。オフィスは待てない。",
    "対面で価値を出して。",
    "地理がまた大事になった。",
    "雑談も君がいないと違ったよ。",
    "同じ部屋の方が画面共有もいい。",
    "ログイン場所を更新したよ。",
    "文化を再構築中。体で。",
    "賃貸はリモートじゃない。君もね。",
    "モニターもここに置こう。",
    "ツールは補助だ。",
    "オープンフロア、寂しかったよ。",
    "プロセスには距離が必要だ。",
    "君の不在、何度も気づいたよ。",
    "ビデオ疲れ？対面で治った。",
  ],
};

interface CameraViewProps {
  onExpressionChange: (score: number) => void;
}

export default function CameraView({ onExpressionChange }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [faceBoxes, setFaceBoxes] = useState<Array<{ x: number; y: number; width: number; height: number; maskId: string; sentence: string; maskType: string; landmarks?: any }>>([]);
  const animationFrameRef = useRef<number>();
  const lastRenderTimeRef = useRef<number>(0);
  const currentFacesRef = useRef<Array<{ x: number; y: number; width: number; height: number; maskId: string; sentence: string; maskType: string; landmarks?: any; lastSwapTime?: number }>>([]);
  const faceSwapIntervalsRef = useRef<Map<number, number>>(new Map()); // Store individual swap times per face index

  useEffect(() => {
    let stream: MediaStream;

    async function init() {
      try {
        // Load face detection models
        setIsLoading(true);
        await loadModels();

        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setHasPermission(true);
            setIsLoading(false);
            startDetection();
          };
        }
      } catch (err) {
        console.error("Error initializing:", err);
        setError(
          "Failed to access camera. Please ensure camera permissions are granted."
        );
        setIsLoading(false);
      }
    }

    function startDetection() {
      const detect = async () => {
        if (
          !videoRef.current ||
          !canvasRef.current ||
          videoRef.current.readyState !== 4
        ) {
          animationFrameRef.current = requestAnimationFrame(detect);
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        // Set canvas size to match video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            setCanvasDimensions({ width: video.videoWidth, height: video.videoHeight });
          } else {
            // Skip this frame if video dimensions aren't ready
            animationFrameRef.current = requestAnimationFrame(detect);
            return;
          }
        }

        // Draw video frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Detect faces
        const detections = await detectFace(video);

        if (detections && detections.length > 0) {
          const currentTime = Date.now();
          let shouldRender = false;

          const newFaceBoxes = detections.map((detection, index) => {
            const detectionBox = detection.detection.box;
            const maskId = `face-${index}`; // Use index to keep face stable

            // Find previous face data from ref (not state)
            const prevFace = currentFacesRef.current[index];

            // Check if THIS specific face should swap (each face has independent timer)
            const lastSwapTime = faceSwapIntervalsRef.current.get(index) || 0;
            const swapInterval = 7000 + (index * 1500); // 7-10.5 seconds, staggered by index
            const shouldSwapThisFace = currentTime - lastSwapTime > swapInterval;

            let maskType: string;
            let sentence: string;

            if (shouldSwapThisFace || !prevFace) {
              // Time to swap THIS face or new face - generate random mask and sentence
              const maskTypes = ['marc', 'tomo', 'heng'];
              maskType = maskTypes[Math.floor(Math.random() * maskTypes.length)];
              const sentences = SENTENCES[maskType as keyof typeof SENTENCES];
              sentence = sentences[Math.floor(Math.random() * sentences.length)];

              // Update this face's swap time
              faceSwapIntervalsRef.current.set(index, currentTime);
              shouldRender = true; // Force render when any face swaps
            } else {
              // Keep previous mask and sentence
              maskType = prevFace.maskType;
              sentence = prevFace.sentence;
            }

            return {
              x: detectionBox.x,
              y: detectionBox.y,
              width: detectionBox.width,
              height: detectionBox.height,
              maskId,
              sentence,
              maskType,
              landmarks: detection.landmarks,
            };
          });

          // Update ref immediately (no re-render)
          currentFacesRef.current = newFaceBoxes;

          // Only update state every 100ms to reduce flickering, OR when any face swaps
          const shouldUpdateState = currentTime - lastRenderTimeRef.current > 100 || shouldRender;

          if (shouldUpdateState) {
            setFaceBoxes(newFaceBoxes);
            lastRenderTimeRef.current = currentTime;
          }

          // Clean up swap times for faces that no longer exist
          const currentFaceIndices = new Set(newFaceBoxes.map((_, idx) => idx));
          for (const [faceIndex] of faceSwapIntervalsRef.current) {
            if (!currentFaceIndices.has(faceIndex)) {
              faceSwapIntervalsRef.current.delete(faceIndex);
            }
          }
        } else {
          currentFacesRef.current = [];
          setFaceBoxes([]);
          faceSwapIntervalsRef.current.clear(); // Clear all timers when no faces detected
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    }

    init();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onExpressionChange]);

  return (
    <div className="relative w-full h-full" style={{ background: '#000000', border: '2px inset #808080' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Loading camera and models...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-20 bg-black">
          <div className="bg-red-900/50 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        style={{ display: hasPermission ? "none" : "block" }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        style={{
          display: hasPermission ? "block" : "none",
          transform: 'scaleX(-1)',
          objectFit: 'cover'
        }}
      />

      {/* Face mask overlay - sits between canvas and grid */}
      {hasPermission && faceBoxes.length > 0 && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15, transform: 'scaleX(-1)' }}>
          <FaceMaskOverlay
            faceBoxes={faceBoxes}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />
        </div>
      )}

      {/* Measurement overlay */}
      {hasPermission && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30, transform: 'scaleX(-1)' }}>
          <MeasurementOverlay
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
            faceBoxes={faceBoxes}
          />
        </div>
      )}
    </div>
  );
}
