import React from "react";
import LotusIcon from "./LotusIcon";

// Icon components
const QueueListIcon = ({ className }: { className?: string }) => (
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
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
    />
  </svg>
);

const LuMoonStar = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 5h4" />
    <path d="M20 3v4" />
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  </svg>
);

const WiDaySunny = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
  </svg>
);

const WiSunrise = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2v6m0 0l2-2m-2 2L10 6m-8 6h2m16 0h2M6 20h12M5 16a7 7 0 0114 0" />
  </svg>
);

const WiSunset = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 10v6m0 0l2-2m-2 2l-2-2M4 20h16M5 16a7 7 0 0114 0m-17-4h2m16 0h2" />
  </svg>
);

interface Sequence {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  targetDurationMinutes: number;
  intensity: string;
}

interface MockRelatedSequencesProps {
  sequences: Sequence[];
  className?: string;
}

// Helper functions from your real app
const getDifficultyClassName = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "difficulty-beginner";
    case "intermediate":
      return "difficulty-intermediate";
    case "advanced":
      return "difficulty-advanced";
    default:
      return "difficulty-beginner";
  }
};

const getIntensityClassName = (intensity: string) => {
  switch (intensity.toLowerCase()) {
    case "gentle":
      return "intensity-gentle";
    case "moderate":
      return "intensity-moderate";
    case "vigorous":
      return "intensity-vigorous";
    default:
      return "intensity-gentle";
  }
};

// Mock SequenceCard component
const MockSequenceCard = ({ sequence }: { sequence: Sequence }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // Focus area icon component matching your real component
  const FocusAreaIcon = ({ sequenceName }: { sequenceName: string }) => {
    const lowerSequenceName = sequenceName?.toLowerCase() || "";

    const getFocusAreaData = () => {
      // Check for moon salutation
      if (lowerSequenceName.includes("moon")) {
        return {
          icon: LuMoonStar,
          gradient:
            "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200",
          iconColor: "text-indigo-600",
        };
      }

      // Check for morning/energizing sequences
      if (
        lowerSequenceName.includes("morning") ||
        lowerSequenceName.includes("energizing")
      ) {
        return {
          icon: WiSunrise,
          gradient:
            "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200",
          iconColor: "text-amber-600",
        };
      }

      // Check for evening/calming sequences
      if (
        lowerSequenceName.includes("evening") ||
        lowerSequenceName.includes("wind-down") ||
        lowerSequenceName.includes("bedtime")
      ) {
        return {
          icon: WiSunset,
          gradient:
            "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200",
          iconColor: "text-orange-600",
        };
      }

      // Check for sun salutations
      if (lowerSequenceName.includes("sun")) {
        return {
          icon: WiDaySunny,
          gradient:
            "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200",
          iconColor: "text-yellow-600",
        };
      }

      // Default to lotus with purple theme
      return {
        icon: LotusIcon,
        gradient:
          "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200",
        iconColor: "text-purple-600",
      };
    };

    const { icon: Icon, gradient, iconColor } = getFocusAreaData();

    return (
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${gradient}`}
      >
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
    );
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group h-full overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center">
          <FocusAreaIcon sequenceName={sequence.name} />
          <div className="flex-1 min-w-0 ml-4 flex flex-col justify-center">
            <h2 className="text-xl font-semibold transition-colors duration-200 line-clamp-2 mb-1 text-purple-600 no-underline">
              {sequence.name}
            </h2>
            <div className="flex items-center flex-wrap gap-x-2 text-xs text-gray-500 mt-1">
              <span
                className={`font-medium ${getDifficultyClassName(sequence.difficulty)}`}
              >
                {sequence.difficulty.charAt(0).toUpperCase() +
                  sequence.difficulty.slice(1)}
              </span>
              <span className="text-gray-400">•</span>
              <span>Multi-pose flow</span>
              <span className="text-gray-400">•</span>
              <span>
                {formatDuration(sequence.targetDurationMinutes)
                  .replace("m", " min")
                  .replace("h", " hr")}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {sequence.description && (
          <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {sequence.description}
          </p>
        )}

        {/* Tags and Info Section */}
        <div className="mt-auto">
          <div className="flex justify-between items-end">
            {/* Left side - intensity */}
            <div className="flex flex-wrap gap-3 items-center">
              <span
                className={`inline-block text-xs font-medium ${getIntensityClassName(sequence.intensity)}`}
              >
                {sequence.intensity}
              </span>
            </div>

            {/* Maya curated - Always bottom right */}
            <div className="text-xs text-gray-500">
              <span className="maya-name">Maya</span> curated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MockRelatedSequences: React.FC<MockRelatedSequencesProps> = ({
  sequences,
  className = "",
}) => {
  if (!sequences || sequences.length === 0) return null;

  return (
    <div className={`flex justify-start ${className}`}>
      <div className="max-w-[90%] md:max-w-2xl w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden mock-related-sequences">
          <style jsx>{`
            .mock-related-sequences p {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
            }
            .mock-related-sequences h1,
            .mock-related-sequences h2,
            .mock-related-sequences h3,
            .mock-related-sequences h4,
            .mock-related-sequences h5,
            .mock-related-sequences h6 {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
            }
          `}</style>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 mr-3 flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500">
                <QueueListIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 transition-colors duration-200 text-purple-600">
                  Related Sequences
                </h3>
                <p className="text-sm text-gray-600">
                  From Maya&apos;s collection with detailed guides
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {sequences.map((sequence) => (
                <div
                  key={sequence.id}
                  className="transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <MockSequenceCard sequence={sequence} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the required CSS styles - you should include this in your global CSS
export const mockRelatedSequencesStyles = `
  .maya-name {
    background: linear-gradient(135deg, #a855f7, #ec4899);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    display: inline;
  }

  .difficulty-beginner {
    background: linear-gradient(135deg, #10b981, #34d399);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: inline;
  }

  .difficulty-intermediate {
    background: linear-gradient(135deg, #0ea5e9, #06b6d4);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: inline;
  }

  .difficulty-advanced {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: inline;
  }

  .intensity-gentle {
    background: linear-gradient(135deg, #10b981, #34d399);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: inline;
  }

  .intensity-moderate {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: inline;
  }

  .intensity-vigorous {
    background: linear-gradient(135deg, #ef4444, #f87171);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: inline;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Demo component for testing - you can remove this if not needed
export const Demo = () => {
  const mockSequences = [
    {
      id: "1",
      name: "Evening Wind-Down Flow",
      description:
        "A calming sequence designed to release tension from your day and prepare your body and mind for restful sleep. Perfect for unwinding after work.",
      difficulty: "beginner",
      targetDurationMinutes: 18,
      intensity: "gentle",
    },
    {
      id: "2",
      name: "Bedtime Relaxation Sequence",
      description:
        "Deep relaxation poses that help quiet the mind and relax the body. Focuses on gentle stretches and breathing techniques.",
      difficulty: "beginner",
      targetDurationMinutes: 15,
      intensity: "gentle",
    },
    {
      id: "3",
      name: "Gentle Night Flow",
      description:
        "Soothing poses specifically chosen for their calming effects. Great for releasing physical and mental tension.",
      difficulty: "beginner",
      targetDurationMinutes: 12,
      intensity: "gentle",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{mockRelatedSequencesStyles}</style>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">
          Mock Related Sequences - Improved
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Full Width Version
            </h2>
            <MockRelatedSequences sequences={mockSequences} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockRelatedSequences;
