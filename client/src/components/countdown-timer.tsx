import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetTime: string; // HH:MM format
  onComplete: () => void;
}

export default function CountdownTimer({ targetTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const [hours, minutes] = targetTime.split(':').map(Number);
      const target = new Date(today.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
      
      // If target time has passed today, set it for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const difference = target.getTime() - now.getTime();
      
      if (difference <= 0) {
        onComplete();
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetTime, onComplete]);

  return (
    <div className="flex justify-center space-x-4 mb-3">
      <div className="text-center">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-brand-200">
          <div className="text-2xl font-bold text-brand-600">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-wider">Hours</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-brand-200">
          <div className="text-2xl font-bold text-brand-600">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-wider">Minutes</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-brand-200">
          <div className="text-2xl font-bold text-brand-600">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-wider">Seconds</div>
        </div>
      </div>
    </div>
  );
}
