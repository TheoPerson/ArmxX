"use client";

import { type ChangeEvent, type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "./icons";
import { downloadFile, parseImport, toCsv, toJson } from "@/lib/export";
import { EXERCISES, formatDuration, formatSessionDate, formatSessionTime, getDailySessionCounts, getRecentDayLabels, makeSession, type Exercise, type Session, totalReps } from "@/lib/workout";
import { getSessions, saveSession, saveSessions } from "@/lib/storage";

type View = "home" | "history" | "settings";
type Toast = { message: string; kind?: "success" | "error" };

function useNetworkStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);
  return online;
}

function useServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((registration) => registration.unregister()))).catch(() => undefined);
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
}

function Nav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  const items: Array<{ id: View; label: string; icon: IconName }> = [
    { id: "home", label: "Aujourd'hui", icon: "home" },
    { id: "history", label: "Historique", icon: "history" },
    { id: "settings", label: "Réglages", icon: "settings" },
  ];
  return <nav className="bottom-nav" aria-label="Navigation principale"><div className="bottom-nav-inner">{items.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} aria-current={view === item.id ? "page" : undefined} onClick={() => onChange(item.id)}><Icon name={item.icon} size={19} /><span>{item.label}</span></button>)}</div></nav>;
}

function Topbar({ online, dark, onToggleTheme }: { online: boolean; dark: boolean; onToggleTheme: () => void }) {
  return <header className="topbar"><a className="brand" href="#main"><span className="brand-mark"><Icon name="activity" size={18} strokeWidth={2.2} /></span><span className="brand-name">ArmX</span></a><div className="topbar-actions"><span className={`status-pill ${online ? "" : "offline"}`}><span className="status-dot" />{online ? "Prêt hors-ligne" : "Hors-ligne"}</span><button className="icon-button" aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"} onClick={onToggleTheme}><Icon name={dark ? "sun" : "moon"} size={18} /></button></div></header>;
}

function HomeView({ sessions, onStart, onViewHistory }: { sessions: Session[]; onStart: (exercise: Exercise) => void; onViewHistory: () => void }) {
  const total = totalReps(sessions);
  const counts = getDailySessionCounts(sessions);
  const labels = getRecentDayLabels();
  const maxCount = Math.max(...counts, 1);
  return <>
    <section className="page-intro"><p className="eyebrow">Session du jour</p><h1 className="headline">Construis des avant-bras solides.</h1><p className="subcopy">Un entraînement précis, sans distraction. Tes données restent sur ton appareil.</p></section>
    <section className="today-card" aria-labelledby="today-title"><div className="today-card-copy"><p className="eyebrow">Focus du jour</p><h2 id="today-title">La force se construit une répétition à la fois.</h2><p>Choisis un mouvement et entre dans le rythme. Chaque série est enregistrée automatiquement.</p></div><div className="today-card-footer"><div className="stat-cluster"><div><span className="stat-value">{total}</span><span className="stat-label">Répétitions</span></div><div><span className="stat-value">{sessions.length}</span><span className="stat-label">Séances</span></div></div><button className="primary-button" onClick={() => onStart(EXERCISES[0])}>Commencer <Icon name="arrowRight" size={16} /></button></div></section>
    <div className="section-row"><div><p className="eyebrow">Bibliothèque</p><h2 className="section-title">Choisir un mouvement</h2></div><p className="section-note">3 mouvements</p></div>
    <section className="exercise-grid" aria-label="Exercices disponibles">{EXERCISES.map((exercise) => <article className="exercise-card" key={exercise.id}><div><div className="exercise-icon"><Icon name={exercise.icon} size={21} /></div><h3>{exercise.name}</h3><p>{exercise.description}</p></div><div className="exercise-card-footer"><span className="exercise-target">{exercise.targetSets} × {exercise.targetReps} reps</span><button className="round-button" aria-label={`Démarrer ${exercise.name}`} onClick={() => onStart(exercise)}><Icon name="arrowRight" size={17} /></button></div></article>)}</section>
    <div className="section-row"><div><p className="eyebrow">Ton rythme</p><h2 className="section-title">Les 7 derniers jours</h2></div><button className="text-button" onClick={onViewHistory}>Voir l&apos;historique</button></div>
    <section className="insight-row"><article className="insight-card"><h3>Régularité</h3><p>{sessions.length ? "Ton historique prend forme." : "Ta première séance donnera le signal."}</p><div className="mini-bars" aria-label="Séances des sept derniers jours">{counts.map((count, index) => <div className="mini-bar-wrap" key={`${labels[index]}-${index}`}><span className="mini-bar" style={{ height: `${Math.max((count / maxCount) * 100, 7)}%`, opacity: count ? 0.9 : 0.25 }} /><span className="mini-bar-label">{labels[index]}</span></div>)}</div></article><article className="insight-card"><h3>Constance</h3><p>Jours actifs cette semaine</p><div className="streak-number">{new Set(sessions.filter((session) => Date.now() - new Date(session.date).getTime() < 7 * 86400000).map((session) => session.date.slice(0, 10))).size}<small>/ 7 jours</small></div></article></section>
  </>;
}

function HistoryView({ sessions, onStart }: { sessions: Session[]; onStart: (exercise: Exercise) => void }) {
  return <><section className="view-header"><div><p className="eyebrow">Journal local</p><h1>Historique</h1><p>Chaque séance, gardée privée et accessible sans connexion.</p></div><button className="icon-button" aria-label="Démarrer une séance" onClick={() => onStart(EXERCISES[0])}><Icon name="plus" size={19} /></button></section>{sessions.length === 0 ? <section className="empty-state"><Icon name="history" size={28} /><h2>Le journal est vierge.</h2><p>Termine une première série pour voir ta progression apparaître ici.</p><button className="primary-button" onClick={() => onStart(EXERCISES[0])}>Démarrer une séance <Icon name="arrowRight" size={16} /></button></section> : <section className="history-list" aria-label="Séances enregistrées">{sessions.map((session) => <article className="history-item" key={session.id}><div className="history-item-main"><div className="history-item-icon"><Icon name="activity" size={18} /></div><div><h3>{session.exerciseName}</h3><p>{formatSessionDate(session.date)} à {formatSessionTime(session.date)}</p></div></div><div className="history-metrics"><div><span className="metric-value">{session.reps}</span><span className="metric-label">reps</span></div><div><span className="metric-value">{session.sets}</span><span className="metric-label">séries</span></div><div><span className="metric-value">{formatDuration(session.durationSeconds)}</span><span className="metric-label">durée</span></div></div></article>)}</section>}</>;
}

function SettingsView({ sessions, onImported, notify, dark, onToggleTheme }: { sessions: Session[]; onImported: (sessions: Session[]) => void; notify: (toast: Toast) => void; dark: boolean; onToggleTheme: () => void }) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const exportJson = () => { downloadFile(toJson(sessions), `forearm-lab-${new Date().toISOString().slice(0, 10)}.json`, "application/json"); notify({ message: "Données JSON exportées." }); };
  const exportCsv = () => { downloadFile(toCsv(sessions), `forearm-lab-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8"); notify({ message: "Données CSV exportées." }); };
  const onFile = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; try { const parsed = parseImport(JSON.parse(await file.text())); await saveSessions(parsed); onImported(parsed); notify({ message: `${parsed.length} séance(s) importée(s).` }); } catch (error) { notify({ message: error instanceof Error ? error.message : "Import impossible.", kind: "error" }); } finally { setFileInputKey((value) => value + 1); } };
  return <><section className="view-header"><div><p className="eyebrow">Contrôle local</p><h1>Réglages</h1><p>Ton entraînement, tes données, ton rythme.</p></div><div className="exercise-icon"><Icon name="shield" size={21} /></div></section><section className="settings-grid"><article className="setting-card"><h2>Exporter tes données</h2><p>Garde une copie portable de ton journal à tout moment.</p><div className="button-stack"><button className="primary-button" onClick={exportJson}><Icon name="download" size={16} /> JSON <span className="sr-only">export</span></button><button className="secondary-button" onClick={exportCsv}><Icon name="download" size={16} /> CSV</button></div><div className="data-note"><Icon name="shield" size={15} /><span>Export local uniquement. Aucun compte, aucun serveur.</span></div></article><article className="setting-card"><h2>Importer un journal</h2><p>Restaure un export JSON sans écraser tes séances existantes.</p><div className="button-stack"><label className="secondary-button" htmlFor={`import-${fileInputKey}`}><Icon name="upload" size={16} /> Choisir un fichier</label><input className="file-input" id={`import-${fileInputKey}`} type="file" accept="application/json,.json" onChange={onFile} /></div><div className="data-note"><Icon name="check" size={15} /><span>Les fichiers invalides sont refusés avant l’écriture.</span></div></article></section><section className="setting-card" style={{ marginTop: 14 }}><h2>Préférences</h2><div className="preference-row"><div><strong>Thème sombre</strong><span>Optimisé pour les séances en salle.</span></div><button className={`toggle ${dark ? "on" : ""}`} aria-pressed={dark} aria-label="Changer le thème" onClick={onToggleTheme} /></div></section></>;
}

function WorkoutOverlay({ exercise, onClose, onComplete, notify }: { exercise: Exercise; onClose: () => void; onComplete: (session: Session) => void; notify: (toast: Toast) => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [setNumber, setSetNumber] = useState(1);
  const [reps, setReps] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [pulsed, setPulsed] = useState(false);
  useEffect(() => { const id = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(id); }, []);
  const progress = Math.min((reps / exercise.targetReps) * 100, 100);
  const addRep = useCallback(() => { setReps((value) => Math.min(value + 1, exercise.targetReps)); setPulsed(true); window.setTimeout(() => setPulsed(false), 240); }, [exercise.targetReps]);
  useEffect(() => { closeButtonRef.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.code === "Space" && event.target === document.body) { event.preventDefault(); addRep(); } }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [addRep, onClose]);
  const nextSet = () => { if (reps < exercise.targetReps) { notify({ message: `Encore ${exercise.targetReps - reps} répétition(s) pour cette série.` }); return; } if (setNumber >= exercise.targetSets) { const session = makeSession(exercise, exercise.targetSets, exercise.targetSets * exercise.targetReps, seconds); onComplete(session); return; } setSetNumber((value) => value + 1); setReps(0); notify({ message: `Série ${setNumber} validée.` }); };
  return <div className="workout-overlay" role="dialog" aria-modal="true" aria-labelledby="workout-title"><div className="workout-frame"><div className="workout-topbar"><button ref={closeButtonRef} className="icon-button" aria-label="Fermer la séance" onClick={onClose}><Icon name="arrowLeft" size={19} /></button><span className="workout-progress-copy">Série {setNumber} / {exercise.targetSets}</span><button className="icon-button" aria-label="Réinitialiser les répétitions" onClick={() => { setReps(0); notify({ message: "Série réinitialisée." }); }}><Icon name="rotate" size={18} /></button></div><section className="workout-head"><p className="eyebrow">En mouvement</p><h1 id="workout-title">{exercise.name}</h1><p>{exercise.description} · Objectif {exercise.targetReps} répétitions</p><div className="progress-track" aria-label={`Progression de la série: ${Math.round(progress)} pour cent`}><span style={{ width: `${progress}%` }} /></div></section><section className="rep-stage"><div className="rep-ring" style={{ "--ring-progress": `${progress}%` } as CSSProperties}><div className="rep-value"><strong>{reps}</strong><span>/ {exercise.targetReps} reps</span></div></div></section><div className="rep-actions"><button className="rep-adjust" aria-label="Retirer une répétition" onClick={() => setReps((value) => Math.max(value - 1, 0))}><Icon name="minus" size={21} /></button><button className={`rep-add ${pulsed ? "pulsed" : ""}`} aria-label="Ajouter une répétition" onClick={addRep}><Icon name="plus" size={30} strokeWidth={1.8} /></button><button className="rep-adjust" aria-label="Ajouter une répétition" onClick={addRep}><Icon name="plus" size={21} /></button></div><div className="timer-chip"><Icon name="clock" size={14} /> {formatDuration(seconds)} · Appuie sur espace pour +1</div><div className="set-controls"><button className="secondary-button" onClick={onClose}>Quitter</button><button className="primary-button" onClick={nextSet}>{setNumber >= exercise.targetSets ? "Terminer" : "Valider la série"} <Icon name="check" size={16} /></button></div></div></div>;
}

export default function ForearmLabApp() {
  const [view, setView] = useState<View>("home");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [workout, setWorkout] = useState<Exercise | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [dark, setDark] = useState(true);
  const online = useNetworkStatus();
  useServiceWorker();
  const notify = useCallback((nextToast: Toast) => { setToast(nextToast); window.setTimeout(() => setToast(null), 2800); }, []);
  useEffect(() => { getSessions().then(setSessions).catch(() => notify({ message: "Lecture locale impossible.", kind: "error" })); const saved = window.localStorage.getItem("forearm-theme"); if (saved === "light") setDark(false); }, [notify]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; window.localStorage.setItem("forearm-theme", dark ? "dark" : "light"); }, [dark]);
  const toggleTheme = () => setDark((value) => !value);
  const completeWorkout = async (session: Session) => { try { await saveSession(session); setSessions((items) => [session, ...items]); setWorkout(null); setView("history"); notify({ message: "Séance enregistrée. Beau travail." }); } catch { notify({ message: "La séance n'a pas pu être enregistrée.", kind: "error" }); } };
  const importSessions = (imported: Session[]) => setSessions((items) => { const map = new Map(items.map((item) => [item.id, item])); imported.forEach((item) => map.set(item.id, item)); return [...map.values()].sort((a, b) => b.date.localeCompare(a.date)); });
  const content = useMemo(() => { if (view === "history") return <HistoryView sessions={sessions} onStart={setWorkout} />; if (view === "settings") return <SettingsView sessions={sessions} onImported={importSessions} notify={notify} dark={dark} onToggleTheme={toggleTheme} />; return <HomeView sessions={sessions} onStart={setWorkout} onViewHistory={() => setView("history")} />; }, [dark, notify, sessions, view]);
  return <main id="main" className="app-shell"><div className="app-frame" aria-hidden={workout ? "true" : undefined}><Topbar online={online} dark={dark} onToggleTheme={toggleTheme} />{content}</div><div aria-hidden={workout ? "true" : undefined}><Nav view={view} onChange={setView} /></div>{workout && <WorkoutOverlay exercise={workout} onClose={() => setWorkout(null)} onComplete={completeWorkout} notify={notify} />}{toast && <div className={`toast ${toast.kind === "error" ? "error" : ""}`} role="status" aria-live="polite"><Icon name={toast.kind === "error" ? "rotate" : "check"} size={16} />{toast.message}</div>}</main>;
}
