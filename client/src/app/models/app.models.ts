export interface User {
  id: string; name: string; email: string; role: 'patient' | 'doctor' | 'admin';
  phone?: string; specialization?: string; qualification?: string; consultationFee?: number;
}
export interface Doctor {
  _id: string; name: string; email: string; specialization: string;
  qualification: string; consultationFee: number;
}
export interface Appointment {
  _id: string; date: string; time: string; reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  doctor?: Doctor; patient?: { name: string; email: string; phone?: string };
}
