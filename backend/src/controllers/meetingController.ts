import Meeting from '../models/Meeting';
import { Request, Response } from 'express';

export const createMeeting = async (req: Request, res: Response) => {
  const { mentee, date, durationMinutes, subject, message } = req.body;
  const mentor = req.user._id;

  const meeting = await Meeting.create({ mentor, mentee, date, durationMinutes, subject, message });
  res.status(201).json(meeting);
};

export const getMeetingsForUser = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const meetings = await Meeting.find({
    $or: [{ mentor: userId }, { mentee: userId }]
  }).populate('mentor', 'firstName lastName').populate('mentee', 'firstName lastName');
  res.json(meetings);
};

export const confirmMeeting = async (req: Request, res: Response) => {
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
  res.json(meeting);
};

export const cancelMeeting = async (req: Request, res: Response) => {
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
  res.json(meeting);
};

export const deleteMeeting = async (req: Request, res: Response) => {
  await Meeting.findByIdAndDelete(req.params.id);
  res.json({ message: 'Rendez-vous supprimé.' });
};



export const   meetingController = {
  createMeeting,
getMeetingsForUser,
confirmMeeting,
cancelMeeting,
deleteMeeting

}

export default meetingController;




  
