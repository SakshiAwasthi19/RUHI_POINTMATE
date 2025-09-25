import React from 'react';

interface PointsProgressProps {
  totalPoints: number;
  requiredPoints?: number;
  domainBreakdown?: {
    domain: string;
    points: number;
    color: string;
  }[];
}

const PointsProgress: React.FC<PointsProgressProps> = ({
  totalPoints,
  requiredPoints = 100,
  domainBreakdown = []
}) => {
  const percentage = Math.min((totalPoints / requiredPoints) * 100, 100);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">PointMate Progress</h3>
      
      <div className="mb-6">
        {/* Circular progress indicator */}
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            
            {/* Progress circle */}
            <circle
              className="text-blue-600 transition-all duration-1000 ease-in-out"
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.51327}, 251.327`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{totalPoints}</span>
            <span className="text-sm text-gray-500">of {requiredPoints} pts</span>
          </div>
        </div>
      </div>
      
      {/* Status text */}
      <div className="text-center mb-6">
        <p className="text-lg font-medium">
          {totalPoints >= requiredPoints ? (
            <span className="text-green-600">Target achieved! Great job!</span>
          ) : (
            <span className="text-blue-600">{requiredPoints - totalPoints} points to go!</span>
          )}
        </p>
      </div>
      
      {/* Domain breakdown */}
      {domainBreakdown.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">Points by Domain</h4>
          <div className="space-y-3">
            {domainBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.domain}</span>
                  <span className="text-sm font-medium text-gray-700">{item.points} pts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${(item.points / totalPoints) * 100}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsProgress;