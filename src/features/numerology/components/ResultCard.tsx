"use client";

import { motion } from "framer-motion";
import html2canvas from "html2canvas";

type Props = {
  result: any;
};

export default function ResultCard({
  result,
}: Props) {
  async function handleShare() {
    const card =
      document.getElementById(
        "share-card"
      );

    if (!card) return;

    const canvas =
      await html2canvas(card, {
        backgroundColor: "#06061a",
        scale: 2,
        useCORS: true,
      });

    const image =
      canvas.toDataURL("image/png");

    const link =
      document.createElement("a");

    link.href = image;

    link.download =
      "destinyra-result.png";

    link.click();

    const text = `
✨ ${result.name}'s Destinyra Result ✨

Life Path: ${result.number}
${result.title}

${
  result.masterNumber
    ? `✨ Master Number: ${result.masterNumber}`
    : ""
}

Discover your destiny:
https://destinyra.vercel.app
`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  }

  return (
    <>
      {/* SHARE CARD */}
      <div
        id="share-card"
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          width: "1080px",
          height: "1600px",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #070513 0%, #03030a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "'Segoe UI', sans-serif",
        }}
      >
        {/* GRID */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize:
              "56px 56px",
          }}
        />

        {/* GLOW */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(145,80,255,0.45) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -100,
            bottom: -100,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,170,255,0.25) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* STARS */}
        {Array.from({
          length: 26,
        }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 2 === 0 ? 3 : 2,
              height:
                i % 2 === 0 ? 3 : 2,
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.75)",
              top: `${
                Math.random() * 100
              }%`,
              left: `${
                Math.random() * 100
              }%`,
              boxShadow:
                "0 0 10px rgba(255,255,255,0.8)",
            }}
          />
        ))}

        {/* MAIN */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent:
              "space-between",
            textAlign: "center",
            padding:
              "90px 90px 70px",
          }}
        >
          {/* TOP */}
          <div>
            <h1
              style={{
                fontSize: 84,
                fontWeight: 900,
                margin: 0,
                color: "#fff",
                letterSpacing: 1,
                textShadow:
                  `
                  0 0 12px rgba(255,255,255,0.8),
                  0 0 40px rgba(160,80,255,1),
                  0 0 90px rgba(120,40,255,0.8)
                `,
              }}
            >
              Destinyra ✦
            </h1>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: 16,
                width: 420,
                margin:
                  "20px auto",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "rgba(180,140,255,0.2)",
                }}
              />

              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius:
                    "50%",
                  background:
                    "#cfa8ff",
                  boxShadow:
                    "0 0 12px rgba(190,140,255,1)",
                }}
              />

              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "rgba(180,140,255,0.2)",
                }}
              />
            </div>

            <p
              style={{
                fontSize: 28,
                letterSpacing: 12,
                textTransform:
                  "uppercase",
                color:
                  "rgba(220,200,255,0.6)",
                margin: 0,
              }}
            >
              {result.name}
            </p>
          </div>

          {/* CENTER */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection:
                "column",
              alignItems:
                "center",
            }}
          >
            {/* NUMBER */}
            <div
              style={{
                fontSize: 240,
                fontWeight: 900,
                lineHeight: 1,
                color: "#fff",
                textShadow:
                  `
                  0 0 20px rgba(255,255,255,0.8),
                  0 0 60px rgba(170,90,255,1),
                  0 0 120px rgba(140,60,255,0.9)
                `,
              }}
            >
              {result.number}
            </div>

            {/* TITLE */}
            <div
              style={{
                fontSize: 78,
                fontWeight: 800,
                color: "#fff",
                marginTop: 8,
                textShadow:
                  `
                  0 0 10px rgba(255,255,255,0.5),
                  0 0 35px rgba(160,80,255,0.5)
                `,
              }}
            >
              {result.title}
            </div>

            {/* MASTER NUMBER */}
            {result.masterNumber && (
              <div
                style={{
                  marginTop: 26,
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#ffd86b",
                  textShadow:
                    `
                    0 0 12px rgba(255,220,120,0.8),
                    0 0 30px rgba(255,200,60,0.5)
                  `,
                }}
              >
                ✦ Master Number{" "}
                {
                  result.masterNumber
                } ✦
              </div>
            )}

            {/* QUOTE */}
            <div
              style={{
                marginTop: 60,
                maxWidth: 850,
                fontSize: 42,
                lineHeight: 1.8,
                fontStyle: "italic",
                fontWeight: 300,
                color:
                  "rgba(240,230,255,0.88)",
                textShadow:
                  "0 0 18px rgba(160,80,255,0.15)",
              }}
            >
              "
              {
                result.description?.split(
                  "."
                )[0]
              }
              ."
            </div>

            {/* STRENGTHS */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                flexWrap: "wrap",
                gap: 44,
                marginTop: 60,
              }}
            >
              {result.strengths
                ?.slice(0, 3)
                .map(
                  (
                    item: string,
                    i: number
                  ) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        gap: 12,
                        color: "#7ee8ff",
                        fontSize: 36,
                        fontWeight: 700,
                        lineHeight: 1,
                        textShadow:
                          `
                          0 0 12px rgba(0,220,255,0.4),
                          0 0 24px rgba(0,220,255,0.15)
                        `,
                      }}
                    >
                      <span
                        style={{
                          color:
                            "#ff9f5b",
                          textShadow:
                            "0 0 10px rgba(255,160,90,0.8)",
                        }}
                      >
                        ⚡
                      </span>

                      {item}
                    </div>
                  )
                )}
            </div>

            {/* LOVE */}
            <div
              style={{
                marginTop: 70,
                width: "100%",
                maxWidth: 920,
                padding:
                  "48px 60px",
                borderRadius: 42,
                background:
                  "linear-gradient(135deg, rgba(255,0,120,0.12) 0%, rgba(120,60,255,0.14) 100%)",
                border:
                  "1px solid rgba(255,120,180,0.18)",
                boxShadow:
                  `
                  0 0 40px rgba(255,0,120,0.08),
                  inset 0 0 40px rgba(120,60,255,0.05)
                `,
                backdropFilter:
                  "blur(14px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: 12,
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#ff7db7",
                  textShadow:
                    `
                    0 0 14px rgba(255,120,180,0.5),
                    0 0 28px rgba(255,0,120,0.15)
                  `,
                }}
              >
                ❤️ Love Energy
              </div>

              <p
                style={{
                  marginTop: 28,
                  textAlign:
                    "center",
                  fontSize: 34,
                  lineHeight: 1.7,
                  color:
                    "rgba(245,230,255,0.88)",
                  fontWeight: 300,
                }}
              >
                {result.love}
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              alignItems:
                "center",
              gap: 12,
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontSize: 24,
                letterSpacing: 10,
                color:
                  "rgba(200,180,255,0.35)",
                textShadow:
                  "0 0 12px rgba(170,120,255,0.15)",
              }}
            >
              ✦ destinyra.vercel.app ✦
            </div>

            <div
              style={{
                fontSize: 18,
                letterSpacing: 4,
                color:
                  "rgba(200,180,255,0.18)",
              }}
            >
              https://destinyra.vercel.app
            </div>
          </div>
        </div>
      </div>

      {/* UI RESULT */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          mt-10
          bg-white/5
          rounded-3xl
          p-8
          border border-white/10
          backdrop-blur-xl
        "
      >
        <div className="text-center mb-8">
          <p className="text-gray-400 mb-3">
            Your Life Path
          </p>

          <h2 className="text-8xl font-bold glow-text">
            {result.number}
          </h2>

          <p className="text-3xl mt-4 font-semibold">
            {result.title}
          </p>

          <div className="mt-5">
            {result.masterNumber ? (
              <div className="text-yellow-300 font-semibold tracking-wide">
                ✨ Master Number{" "}
                {
                  result.masterNumber
                } ✨
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Sorry, you don't have
                a Master Number
              </div>
            )}
          </div>
        </div>

        {result.masterData && (
          <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-6 mb-6">
            <h3 className="text-yellow-300 text-2xl font-bold mb-3">
              ✨{" "}
              {
                result.masterData
                  .title
              }
            </h3>

            <p className="text-gray-300 leading-8">
              {
                result.masterData
                  .description
              }
            </p>
          </div>
        )}

        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <p className="text-gray-300 leading-8">
            {result.description}
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 className="text-cyan-400 font-bold mb-4">
            Strengths ⚡
          </h3>

          <div className="flex flex-wrap gap-3">
            {result.strengths?.map(
              (
                item: string,
                i: number
              ) => (
                <span
                  key={i}
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-cyan-500/10
                    border
                    border-cyan-500/20
                    text-cyan-300
                    text-sm
                  "
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 className="text-red-400 font-bold mb-4">
            Weaknesses ⚠️
          </h3>

          <div className="flex flex-wrap gap-3">
            {result.weaknesses?.map(
              (
                item: string,
                i: number
              ) => (
                <span
                  key={i}
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-300
                    text-sm
                  "
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 className="text-cyan-400 font-bold mb-3">
            Career Path 🚀
          </h3>

          <p className="text-gray-300 leading-7">
            {result.career}
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-pink-400 font-bold mb-3">
            Love Style ❤️
          </h3>

          <p className="text-gray-300 leading-7">
            {result.love}
          </p>
        </div>

        <button
          onClick={handleShare}
          className="
            w-full
            p-4
            rounded-2xl
            bg-gradient-to-r
            from-pink-500
            to-purple-600
            hover:scale-[1.02]
            transition-all
            duration-300
            font-semibold
            shadow-2xl
          "
        >
          Share My Destiny ✨
        </button>
      </motion.div>
    </>
  );
}