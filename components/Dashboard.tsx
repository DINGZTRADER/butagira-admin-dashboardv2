import React from 'react';
import { Card } from './ui/Card';
import type { Task, Appointment, ViewState } from '../types';
import { ClientsIcon, CasesIcon, DocumentsIcon } from './ui/Icons';
import { formatDate } from '../utils/date';

interface DashboardProps {
    stats: {
        clients: number;
        cases: number;
        documents: number;
    };
    tasks: Task[];
    appointments: Appointment[];
    onUpdateTask: (taskId: string, completed: boolean) => void;
    setView: (view: ViewState) => void;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: number; icon: React.ReactElement; onClick: () => void; }> = ({ title, value, icon, onClick }) => (
    <Card className="hover:bg-brand-light transition-all duration-300 cursor-pointer" onClick={onClick}>
        <div className="flex items-center">
            <div className="p-3 bg-brand-accent/20 rounded-full mr-4 text-brand-accent">
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ stats, tasks, appointments, onUpdateTask, setView }) => {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Clients" value={stats.clients} icon={<ClientsIcon/>} onClick={() => setView({type: 'clients'})} />
                <StatCard title="Open Cases" value={stats.cases} icon={<CasesIcon />} onClick={() => setView({type: 'cases'})} />
                <StatCard title="Total Documents" value={stats.documents} icon={<DocumentsIcon />} onClick={() => setView({type: 'documents'})}/>
            </div>

            {/* Tasks and Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tasks List */}
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white border-b border-brand-light/20 pb-2">Priority Action Items</h3>
                    <ul className="space-y-3">
                        {tasks.map(task => (
                            <li key={task.id} className="flex items-center p-2 rounded-md hover:bg-brand-dark/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => onUpdateTask(task.id, e.target.checked)}
                                    className="h-5 w-5 rounded bg-brand-dark border-gray-500 text-brand-accent focus:ring-brand-accent"
                                />
                                <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                    {task.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* Upcoming Appointments */}
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white border-b border-brand-light/20 pb-2">Upcoming Appointments</h3>
                    <ul className="space-y-4">
                        {appointments.map(appt => (
                            <li key={appt.id} className="flex items-start p-2 rounded-md">
                                <div className="flex flex-col items-center justify-center mr-4 bg-brand-accent text-brand-dark p-2 rounded-lg">
                                    <span className="font-bold text-lg">{new Date(appt.date).getDate()}</span>
                                    <span className="text-xs uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{appt.title}</p>
                                    <p className="text-sm text-gray-400">With: {appt.with}</p>
                                    <p className="text-sm text-brand-accent font-medium">{appt.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};