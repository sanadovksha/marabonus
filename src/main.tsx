import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type RewardLevel = { level: number; minLoss: number; rate: number };
type UserProgress = { casinoBets: number; casinoLosses: number; nextRewardDate: string };

const initialIsOptedIn = false;

const userProgress: UserProgress = {
  casinoBets: 7,
  casinoLosses: 46,
  nextRewardDate: 'Monday, June 22',
};

const rewardLevels: RewardLevel[] = Array.from({ length: 15 }, (_, index) => {
  const level = index + 1;
  return {
    level,
    minLoss: level === 1 ? 30 : 30 + index * 45,
    rate: 2 + index * 0.75,
  };
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const getCurrentLevel = (losses: number) =>
  [...rewardLevels].reverse().find((level) => losses >= level.minLoss) ?? rewardLevels[0];

function App() {
  const [isOptedIn, setIsOptedIn] = useState(initialIsOptedIn);
  const currentLevel = getCurrentLevel(userProgress.casinoLosses);
  const nextLevel = rewardLevels.find((level) => level.level === currentLevel.level + 1);
  const betsProgress = Math.min((userProgress.casinoBets / 10) * 100, 100);
  const lossesProgress = Math.min((userProgress.casinoLosses / 30) * 100, 100);
  const isEligible = userProgress.casinoBets >= 10 && userProgress.casinoLosses >= 30;
  const potentialReward = useMemo(
    () => Math.floor(userProgress.casinoLosses * (currentLevel.rate / 100)),
    [currentLevel.rate],
  );

  return (
    <main className="page-shell">
      <nav className="top-bar" aria-label="Landing navigation">
        <span className="brand-mark">MaraBonus</span>
        <div>
          <a href="#highlights">Highlights</a>
          <a href="#how-it-works">Mechanics</a>
          <a href="#levels-title">Levels</a>
        </div>
        <button className="nav-button" type="button" onClick={() => setIsOptedIn(true)}>
          {isOptedIn ? 'Active' : 'Opt in'}
        </button>
      </nav>

      <section className="hero-card" aria-labelledby="hero-title">
        <div className="hero-content">
          <span className="eyebrow">Weekly Casino Cash Back</span>
          <h1 id="hero-title">
            {isOptedIn ? 'Cash Back progress. In cinematic detail.' : 'Cash Back. Made to come back every Monday.'}
          </h1>
          <p>
            {isOptedIn
              ? 'Follow your weekly Casino bets, level, and possible reward in one clean landing experience.'
              : 'Activate before you play, then your qualifying Casino losses can turn into a weekly Cash Back reward.'}
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => setIsOptedIn(true)}>
              {isOptedIn ? 'Cash Back Activated' : 'Activate Cash Back'}
            </button>
            <a className="secondary-button" href="#highlights">Watch the flow</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="cashback-device">
            <div className="device-camera" />
            <div className="device-screen">
              <span>Potential return</span>
              <strong>{formatCurrency(potentialReward || 12)}</strong>
              <small>credited Monday</small>
            </div>
          </div>
        </div>
      </section>

      <section id="highlights" className="feature-strip" aria-labelledby="highlights-title">
        <div className="section-title-row">
          <h2 id="highlights-title">Get the highlights.</h2>
          <a href="#how-it-works">Jump to mechanics</a>
        </div>
        <div className="highlight-scroll">
          <article className="highlight-card orange-card">
            <span>Before play</span>
            <h3>Opt in once. Let the week count.</h3>
          </article>
          <article className="highlight-card device-stack-card">
            <span>Live progress</span>
            <h3>Track bets, losses, level, and reward preview.</h3>
            <div className="mini-stack" aria-hidden="true"><i /><i /><i /></div>
          </article>
          <article className="highlight-card blue-card">
            <span>Monday payout</span>
            <h3>Rewards are calculated weekly and credited on schedule.</h3>
          </article>
        </div>
      </section>

      <section className="intro-copy" aria-labelledby="intro-title">
        <span className="pill">Designed for clarity</span>
        <h2 id="intro-title">A premium Cash Back landing that keeps every rule easy to see.</h2>
        <p>Dark space, warm accents, focused cards, and large product-style moments make the program feel simpler without hiding the requirements.</p>
      </section>

      <section className="status-grid" aria-label="Cash Back status">
        <InfoCard title="Participation" value={isOptedIn ? 'Active' : 'Not activated'} accent={isOptedIn ? 'success' : 'warning'}>
          {isOptedIn ? 'You are participating in the weekly Cash Back program.' : 'Opt in first so your weekly Casino activity can count.'}
        </InfoCard>
        <InfoCard title="Next reward date" value={userProgress.nextRewardDate} accent="purple">
          Rewards are calculated weekly and given every Monday.
        </InfoCard>
        <InfoCard title="Current level" value={`Level ${currentLevel.level}`} accent="blue">
          Based on weekly Casino losses. Higher losses can unlock higher levels.
        </InfoCard>
      </section>

      <section id="how-it-works" className="content-card" aria-labelledby="how-title">
        <div className="section-heading">
          <span className="eyebrow">Simple mechanics</span>
          <h2 id="how-title">How Cash Back works</h2>
        </div>
        <div className="steps">
          {['Activate Cash Back before you play.', 'Place at least 10 Casino bets during the week.', 'Reach at least $30 in Casino losses to qualify.', 'Receive your calculated reward every Monday.'].map((step, index) => (
            <article className="step-card" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="progress-layout" aria-label="Weekly progress and reward">
        <div className="progress-card">
          <div className="section-heading compact">
            <span className="eyebrow">Weekly progress</span>
            <h2>{isOptedIn ? 'Your eligibility checklist' : 'What you are missing now'}</h2>
          </div>
          <ProgressRow label="Casino bets placed" value={`${userProgress.casinoBets}/10`} progress={betsProgress} complete={userProgress.casinoBets >= 10} />
          <ProgressRow label="Casino losses" value={`${formatCurrency(userProgress.casinoLosses)}/$30`} progress={lossesProgress} complete={userProgress.casinoLosses >= 30} />
          <div className={`eligibility ${isEligible ? 'ready' : ''}`}>{isEligible ? 'Eligible for this week’s calculation' : 'Complete both requirements to qualify'}</div>
        </div>
        <div className="reward-card">
          <span className="eyebrow">Reward preview</span>
          <h2>{formatCurrency(potentialReward)}</h2>
          <p>Potential Cash Back at Level {currentLevel.level}. This is a mock preview and not a profit promise.</p>
          <div className="next-level">
            {nextLevel ? `Lose ${formatCurrency(Math.max(nextLevel.minLoss - userProgress.casinoLosses, 0))} more in Casino activity to reach Level ${nextLevel.level}.` : 'You are at the highest level this week.'}
          </div>
        </div>
      </section>

      <section className="content-card" aria-labelledby="levels-title">
        <div className="section-heading">
          <span className="eyebrow">15 levels</span>
          <h2 id="levels-title">The more weekly Casino losses, the higher the level can be</h2>
        </div>
        <div className="level-ladder">
          {rewardLevels.map((level) => (
            <div className={`level-tile ${level.level === currentLevel.level ? 'current' : ''}`} key={level.level}>
              <strong>{level.level}</strong>
              <span>from {formatCurrency(level.minLoss)}</span>
              <em>{level.rate.toFixed(2)}%</em>
            </div>
          ))}
        </div>
      </section>

      <section className="motivation-card">
        <h2>{isOptedIn ? 'Keep going toward your next possible reward.' : 'You could be building a weekly return right now.'}</h2>
        <p>{isOptedIn ? 'Your Casino activity is tracked for this weekly Cash Back cycle.' : 'Without activation, your Casino losses do not count toward Cash Back rewards.'}</p>
        {!isOptedIn && <button className="primary-button" type="button" onClick={() => setIsOptedIn(true)}>Activate Cash Back</button>}
      </section>

      <FAQ />
      <Terms />

      {!isOptedIn && (
        <div className="mobile-sticky">
          <button className="primary-button" type="button" onClick={() => setIsOptedIn(true)}>Activate Cash Back</button>
        </div>
      )}
    </main>
  );
}

function InfoCard({ title, value, accent, children }: { title: string; value: string; accent: string; children: React.ReactNode }) {
  return <article className={`info-card ${accent}`}><span>{title}</span><strong>{value}</strong><p>{children}</p></article>;
}

function ProgressRow({ label, value, progress, complete }: { label: string; value: string; progress: number; complete: boolean }) {
  return <div className="progress-row"><div><span>{label}</span><strong>{value}</strong></div><div className="bar" aria-label={`${label}: ${value}`}><span style={{ width: `${progress}%` }} /></div><small>{complete ? 'Requirement met' : 'Still needed'}</small></div>;
}

function FAQ() {
  const items = [
    ['What is Cash Back?', 'Cash Back is a weekly program that may return part of qualifying Casino losses as a reward.'],
    ['How do I qualify?', 'Opt in, place at least 10 Casino bets, and reach at least $30 in Casino losses during the weekly period.'],
    ['When is the reward given?', 'Rewards are calculated weekly and credited every Monday.'],
    ['Does Cash Back guarantee profit?', 'No. Cash Back is based on losses and does not guarantee profit or reduce the risks of gambling.'],
  ];
  return <section className="content-card faq" aria-labelledby="faq-title"><div className="section-heading"><span className="eyebrow">FAQ</span><h2 id="faq-title">Questions people ask</h2></div>{items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>;
}

function Terms() {
  return <section className="terms-card" aria-labelledby="terms-title"><h2 id="terms-title">Terms reminder</h2><ul><li>Cash Back applies to Casino activity only.</li><li>You must opt in before participating.</li><li>Minimum weekly requirements: 10 Casino bets and $30 Casino losses.</li><li>Rewards depend on level, eligibility, and weekly Casino losses.</li><li>Please play responsibly. If gambling stops being fun, take a break.</li></ul></section>;
}

createRoot(document.getElementById('root')!).render(<App />);
