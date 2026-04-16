import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PRAYERS = ["bomdod", "peshin", "asr", "shom", "xufton"];

export default function QazoNamozApp() {
  const [age, setAge] = useState("");
  const [startAge, setStartAge] = useState("");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const [showHistory, setShowHistory] = useState(false);

  // 💾 LOAD
  useEffect(() => {
    const saved = localStorage.getItem("qazo-dashboard");
    if (saved) {
      const data = JSON.parse(saved);
      setResult(data.result || null);
      setHistory(data.history || []);
    }
  }, []);

  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem(
      "qazo-dashboard",
      JSON.stringify({ result, history })
    );
  }, [result, history]);

  // 🚀 CALC
  const calculate = () => {
    const a = Number(age);
    const s = Number(startAge);

    if (!a || !s || a <= s) {
      alert("Yoshni to‘g‘ri kiriting!");
      return;
    }

    const total = (a - s) * 365;

    const prayers = {};
    PRAYERS.forEach((p) => (prayers[p] = total));

    setResult({
      total,
      max: prayers,
      prayers,
    });
  };

  // ✔ DONE
  const done = (name) => {
    setResult((prev) => {
      const updated = {
        ...prev,
        prayers: {
          ...prev.prayers,
          [name]: prev.prayers[name] - 1,
        },
      };

      setHistory((h) => [
        {
          name,
          type: "done",
          time: new Date().toLocaleString(),
        },
        ...h,
      ]);

      return updated;
    });
  };

  // ↩ UNDO
  const undo = (name) => {
    setResult((prev) => {
      const updated = {
        ...prev,
        prayers: {
          ...prev.prayers,
          [name]: prev.prayers[name] + 1,
        },
      };

      setHistory((h) => [
        {
          name,
          type: "undo",
          time: new Date().toLocaleString(),
        },
        ...h,
      ]);

      return updated;
    });
  };

  // 📊 1. QAZO PROGRESS CHART
  const qazoChart = result
    ? PRAYERS.map((p) => ({
        name: p,
        qolgan: result.prayers[p],
        yopildi: result.max[p] - result.prayers[p],
      }))
    : [];

  // 📊 2. WEEKLY ACTIVITY CHART
  const weeklyChart = () => {
    const days = {};

    history.forEach((h) => {
      const day = new Date(h.time).toLocaleDateString("en-US", {
        weekday: "short",
      });

      days[day] = (days[day] || 0) + 1;
    });

    return Object.entries(days).map(([day, value]) => ({
      day,
      value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-md mx-auto">

        {/* HEADER */}
        <h1 className="text-xl font-bold mb-4">
          🕌 Qazo Namoz 
        </h1>

        {/* INPUTS */}
        <input
          className="w-full p-3 border rounded mb-2"
          placeholder="Hozirgi yosh"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Boshlagan yosh"
          value={startAge}
          onChange={(e) => setStartAge(e.target.value)}
        />

        <button
          onClick={calculate}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Hisoblash
        </button>

        {/* 📊 QAZO CHART */}
        {result && (
          <div className="bg-white mt-4 p-3 rounded">
            <h2 className="font-bold mb-2">📊 Qazo Progress</h2>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qazoChart}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qolgan" fill="#ef4444" />
                  <Bar dataKey="yopildi" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* PRAYER CARDS */}
        {result &&
          PRAYERS.map((p) => (
            <div key={p} className="bg-white p-3 rounded mt-3">
              <div className="flex justify-between">
                <b className="capitalize">{p}</b>
                <span>{result.prayers[p]}</span>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => done(p)}
                  className="flex-1 bg-green-500 text-white py-1 rounded"
                >
                  ✔ O‘qildi
                </button>

                <button
                  onClick={() => undo(p)}
                  className="bg-yellow-400 px-3 rounded"
                >
                  ↩
                </button>
              </div>
            </div>
          ))}

        {/* 📊 WEEKLY CHART */}
        {history.length > 0 && (
          <div className="bg-white mt-5 p-3 rounded">
            <h2 className="font-bold mb-2">📅 Weekly Activity</h2>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChart()}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0f172a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {result && (
          <>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full mt-4 bg-slate-800 text-white py-2 rounded"
            >
              {showHistory ? "Tarixni yopish" : "Tarixni ochish"}
            </button>

            {showHistory && (
              <div className="bg-white mt-3 p-3 rounded max-h-52 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Hali amal yo‘q
                  </p>
                ) : (
                  history.map((h, i) => (
                    <div
                      key={i}
                      className="border-b py-1 text-sm flex justify-between"
                    >
                      <div>
                        <b className="capitalize">{h.name}</b>{" "}
                        {h.type === "done" ? "✔" : "↩"}
                      </div>

                      <span className="text-xs text-gray-400">
                        {h.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}