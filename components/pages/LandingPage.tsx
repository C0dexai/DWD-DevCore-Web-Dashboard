import React from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from '../icons/LogoIcon';
import BarChartIcon from '../icons/BarChartIcon';
import { BrainCircuit, Share2 } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-brand-bg/60 backdrop-blur-md p-6 rounded-xl border border-gray-800/50 transition-all duration-300 hover:border-neon-purple/50 hover:-translate-y-1">
        <div className="flex items-center justify-center mb-4 h-8">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-brand-dark font-sans">
             <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1531214159280-07f0031b9199?q=80&w=2070&auto=format&fit=crop"
                    alt="Neon city background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 min-h-screen w-full text-gray-200 overflow-y-auto">
                <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
                    <div className="animate-fade-in-down">
                        <div className="flex justify-center items-center space-x-4 mb-8">
                            <div className="text-neon-purple">
                                <LogoIcon />
                            </div>
                            <span className="text-3xl font-bold text-white text-glow">DevCore</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white text-glow mb-4 leading-tight">
                            Orchestrate. Innovate. <br /> Dominate.
                        </h1>

                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-12">
                            A comprehensive dashboard for managing web development projects, interacting with dev agents, and visualizing build data. Your entire development lifecycle, unified.
                        </p>

                        <Link
                            to="/dashboard"
                            className="inline-block bg-neon-purple text-white font-bold text-lg py-4 px-10 rounded-lg transition-all duration-300 ease-in-out hover:bg-neon-pink hover:shadow-neon-glow-pink transform hover:-translate-y-1"
                        >
                            Launch Dashboard
                        </Link>
                    </div>

                    <div className="mt-24 w-full max-w-5xl animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BrainCircuit size={32} className="text-neon-purple" />}
                                title="AI-Powered Agents"
                                description="Delegate tasks to a specialized team of AI developers who can build, test, and deploy."
                            />
                            <FeatureCard
                                icon={<Share2 size={32} className="text-neon-blue" />}
                                title="Live CI/CD Pipelines"
                                description="Visualize your entire pipeline in real-time, from commit to production deployment."
                            />
                            <FeatureCard
                                icon={<BarChartIcon className="w-8 h-8 text-neon-green" />}
                                title="Insightful Dashboards"
                                description="Monitor project health, track performance metrics, and gain actionable insights."
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>
        </div>
    );
};

export default LandingPage;
