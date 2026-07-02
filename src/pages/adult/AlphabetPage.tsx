import { useState } from 'react';
import { letters } from '../../data/course';
import { speakArabic } from '../../lib/tts';
import { SpeakerButton } from '../../components/ui';
import type { Letter } from '../../lib/content';

export function AlphabetPage() {
  const [selected, setSelected] = useState<Letter | null>(null);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">L'alphabet arabe</h1>
      <p className="mt-1 font-semibold text-ink/60">
        Les 28 lettres + la hamza. Touchez une lettre pour l'écouter et voir ses formes.
      </p>

      <div dir="rtl" className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {letters.map((letter) => (
          <button
            key={letter.translit}
            type="button"
            onClick={() => {
              setSelected(letter);
              speakArabic(letter.char);
            }}
            className={`font-arabic aspect-square rounded-2xl bg-white text-4xl shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow ${
              selected?.translit === letter.translit ? 'ring-2 ring-brand-600' : 'ring-black/5'
            }`}
          >
            {letter.char}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 animate-slide-up">
          <div className="flex flex-wrap items-center gap-5">
            <span className="font-arabic text-7xl text-brand-700">{selected.char}</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black">
                <span className="font-arabic">{selected.name_ar}</span> — {selected.translit}
              </h2>
              <p className="mt-1 font-semibold text-ink/65">Son : {selected.sound_fr}</p>
              <p className="mt-1 text-sm font-semibold text-ink/45">
                {selected.connects_after
                  ? 'Se lie à la lettre suivante.'
                  : 'Ne se lie jamais à la lettre suivante.'}
              </p>
            </div>
            <SpeakerButton text={selected.char} />
          </div>
          <div dir="rtl" className="mt-6 grid grid-cols-4 gap-3 text-center">
            {(
              [
                ['isolated', 'Isolée'],
                ['initial', 'Initiale'],
                ['medial', 'Médiane'],
                ['final', 'Finale'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="rounded-2xl bg-sand-100 p-4">
                <div className="font-arabic text-4xl">{selected.forms[key]}</div>
                <div dir="ltr" className="mt-2 text-xs font-extrabold text-ink/50 uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
