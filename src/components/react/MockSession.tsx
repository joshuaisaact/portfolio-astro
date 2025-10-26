"use client";
import React from "react";

// Icon components
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
    />
  </svg>
);

interface SessionParams {
  durationMinutes: number;
  difficulty: string;
  focusArea?: string;
  anatomicalFocus?: string;
  intensity?: string;
  poseType?: string;
  personalizedNotes?: string;
  sequenceStyle?: string;
  breathworkFocus?: boolean;
}

interface MockSessionSuggestionProps {
  sessionParams: SessionParams;
  onGenerateSession?: (params: SessionParams) => void;
}

const MockSessionSuggestion: React.FC<MockSessionSuggestionProps> = ({
  sessionParams,
  onGenerateSession = () => {},
}) => {
  const formatDisplay = (str: string) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  };

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden mock-session">
      <style jsx>{`
        .mock-session p {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        .mock-session h1,
        .mock-session h2,
        .mock-session h3,
        .mock-session h4,
        .mock-session h5,
        .mock-session h6 {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
      `}</style>
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold mb-1 transition-colors duration-200 text-purple-600">
              Your Personalized Flow
            </h3>
            <p className="text-xs text-gray-600">
              Designed just for you by <span className="maya-name">Maya</span>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Main session info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="flex items-center space-x-1 mb-1 justify-center">
              <ClockIcon className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-gray-600">Duration</span>
            </div>
            <div className="text-sm font-medium text-purple-700">
              {sessionParams.durationMinutes} minutes
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center space-x-1 mb-1 justify-center">
              <ChartBarIcon className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-gray-600">Level</span>
            </div>
            <div className="text-sm font-medium text-purple-700">
              {sessionParams.difficulty.charAt(0).toUpperCase() +
                sessionParams.difficulty.slice(1)}
            </div>
          </div>

          {sessionParams.intensity && (
            <div className="text-center md:col-span-1 col-span-2">
              <div className="flex items-center space-x-1 mb-1 justify-center">
                <FireIcon className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-gray-600">Intensity</span>
              </div>
              <div className="text-sm font-medium capitalize text-purple-700">
                {sessionParams.intensity}
              </div>
            </div>
          )}
        </div>

        {/* Session Focus */}
        {(sessionParams.focusArea ||
          sessionParams.anatomicalFocus ||
          sessionParams.poseType ||
          sessionParams.sequenceStyle ||
          sessionParams.breathworkFocus) && (
          <div className="mb-3">
            <div className="text-xs text-gray-700 mb-2">Session Focus</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {sessionParams.focusArea && (
                <span className="text-sm text-purple-600">
                  {formatDisplay(sessionParams.focusArea)}
                </span>
              )}
              {sessionParams.anatomicalFocus && (
                <>
                  {sessionParams.focusArea && (
                    <span className="text-gray-400">•</span>
                  )}
                  <span className="text-sm text-blue-600">
                    {formatDisplay(sessionParams.anatomicalFocus)}
                  </span>
                </>
              )}
              {sessionParams.poseType && (
                <>
                  {(sessionParams.focusArea ||
                    sessionParams.anatomicalFocus) && (
                    <span className="text-gray-400">•</span>
                  )}
                  <span className="text-sm text-green-600">
                    {formatDisplay(sessionParams.poseType)}
                  </span>
                </>
              )}
              {sessionParams.sequenceStyle && (
                <>
                  {(sessionParams.focusArea ||
                    sessionParams.anatomicalFocus ||
                    sessionParams.poseType) && (
                    <span className="text-gray-400">•</span>
                  )}
                  <span className="text-sm text-orange-600">
                    {formatDisplay(sessionParams.sequenceStyle)}
                  </span>
                </>
              )}
              {sessionParams.breathworkFocus && (
                <>
                  {(sessionParams.focusArea ||
                    sessionParams.anatomicalFocus ||
                    sessionParams.poseType ||
                    sessionParams.sequenceStyle) && (
                    <span className="text-gray-400">•</span>
                  )}
                  <span className="text-sm text-teal-600">
                    🌬️ Breathwork Focus
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Personal notes */}
        {sessionParams.personalizedNotes && (
          <div className="mb-3 border-l-4 border-purple-200 pl-3">
            <h4 className="text-xs text-gray-700 mb-1">💭 Personal Touch</h4>
            <p className="text-xs text-gray-600">
              {formatDisplay(sessionParams.personalizedNotes)}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onGenerateSession(sessionParams)}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-white cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>Create This Flow</span>
        </button>
      </div>
    </div>
  );
};

export default MockSessionSuggestion;
