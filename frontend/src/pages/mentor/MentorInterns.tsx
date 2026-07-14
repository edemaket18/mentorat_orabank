import React from 'react';

const MentorInterns: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">{ ('mentor.interns.title') }</h1>
      <p className="text-gray-700">{ ('mentor.interns.description') }</p>
      {/* Placeholder for future interns components */}
      <div className="mt-6">
        <p className="text-center text-gray-500">{ ('mentor.interns.placeholder') }</p>
        <textarea className="w-full border border-gray-300 rounded-md p-2 mt-2" rows={4} placeholder={ ('mentor.interns.textarea.placeholder') }></textarea>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          { ('mentor.interns.submit') } </button> 
      </div>
      <div className="mt-6">
        <p className="text-center text-gray-500">{ ('mentor.interns.additional') }</p>
      </div>
      <div className="">
        <p className="">
          { ('mentor.interns.additional.info') } <p className="">{ ("")}</p>
        </p>
      </div>
    </div>
  );
}
export default MentorInterns;
