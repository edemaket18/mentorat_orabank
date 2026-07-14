 import React from 'react';


 const MentorFeedback: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">{ ('mentor.feedback.title') }</h1>
      <p className="text-gray-700">{ ('mentor.feedback.description') }</p>
      {/* Placeholder for future feedback components */}
      <div className="mt-6">
        <p className="text-center text-gray-500">{ ('mentor.feedback.placeholder') }</p>
        <textarea className="w-full border border-gray-300 rounded-md p-2 mt-2" rows={4} placeholder={ ('mentor.feedback.textarea.placeholder') }></textarea>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          { ('mentor.feedback.submit') } </button> </div>
        <div className="mt-6">
          <p className="text-center text-gray-500">{ ('mentor.feedback.additional') }</p>
        </div>
        <div className="">
          <p className="">
            { ('mentor.feedback.additional.info') } <p className="">{ ("")}</p>
          </p>
        </div>
    </div>
  );
}

export default MentorFeedback;
