import React from 'react';

const SustainaFoodSection = () => {
    return (
        <div className="bg-white p-6 md:p-20 flex flex-col md:flex-row gap-10 items-center justify-start self-stretch shrink-0 h-auto relative">
            {/* Left Section */}
            <div className="flex flex-col gap-6 items-start justify-center flex-1 relative">
                <div className="text-left font-sans text-2xl font-normal">
                    <span className="text-[#303030] font-poppins font-semibold">We are here</span>
                    <span className="text-[#07aa07] font-poppins font-bold"> for You</span>
                </div>
                <p className="text-[#303030] text-left font-poppins text-base leading-7 font-normal">
                    At SustainaFood, we understand the challenges businesses face with unsold food items. That’s why we’ve created a platform that makes it easy for supermarkets, restaurants, and other stakeholders to redistribute surplus food efficiently and sustainably. Together, we can make a difference—one meal at a time.
                </p>
                <div className="pl-6 flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-row gap-2 items-center">
                        <svg className="w-6 h-6 text-[#07aa07]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                        </svg>
                        <div className="text-[#303030] text-left font-poppins text-base leading-7 font-normal flex-1">Efficient Redistribution</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <svg className="w-6 h-6 text-[#07aa07]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                        </svg>
                        <div className="text-[#303030] text-left font-poppins text-base leading-7 font-normal flex-1">User-Friendly Platform</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <svg className="w-6 h-6 text-[#07aa07]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                        </svg>
                        <div className="text-[#303030] text-left font-poppins text-base leading-7 font-normal flex-1">Dedicated Team</div>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="py-6 flex flex-col gap-6 items-start justify-center flex-1 relative">
                <div className="flex flex-col gap-8 items-start justify-center self-stretch shrink-0 relative">
                    <div className="bg-white rounded-lg p-6 flex flex-row gap-4 items-center justify-start self-stretch shrink-0 relative shadow-lg">
                        <div className="flex flex-row gap-4 items-center justify-start flex-1 relative">
                            <div className="bg-[#3cb018] rounded-full flex flex-row gap-2.5 items-center justify-center shrink-0 w-10 h-10 relative shadow-sm">
                                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1 items-start justify-start flex-1 relative">
                                <div className="text-[#303030] text-left font-poppins text-sm font-bold self-stretch">Fast and Easy Listings</div>
                                <div className="text-[#303030]/70 text-left font-poppins text-sm leading-[19px] font-normal self-stretch">List unsold food items in minutes with our simple interface.</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 flex flex-row gap-4 items-center justify-start self-stretch shrink-0 relative shadow-lg">
                        <div className="flex flex-row gap-4 items-center justify-start flex-1 relative">
                            <div className="bg-[#3cb018] rounded-full flex flex-row gap-2.5 items-center justify-center shrink-0 w-10 h-10 relative shadow-sm">
                                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1 items-start justify-start flex-1 relative">
                                <div className="text-[#303030] text-left font-poppins text-sm font-bold self-stretch">Sustainability Reporting</div>
                                <div className="text-[#303030]/70 text-left font-poppins text-sm leading-[19px] font-normal self-stretch">Track your impact with detailed reports on food redistributed.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 items-start justify-start self-stretch shrink-0 relative">
                    <div className="bg-white rounded-lg p-6 flex flex-row gap-4 items-center justify-start self-stretch shrink-0 relative shadow-lg">
                        <div className="flex flex-row gap-4 items-center justify-start flex-1 relative">
                            <div className="bg-[#3cb018] rounded-full flex flex-row gap-2.5 items-center justify-center shrink-0 w-10 h-10 relative shadow-sm">
                                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1 items-start justify-start flex-1 relative">
                                <div className="text-[#303030] text-left font-poppins text-sm font-bold self-stretch">Instant Notifications</div>
                                <div className="text-[#303030]/70 text-left font-poppins text-sm leading-[19px] font-normal self-stretch">Streamline communication and logistics.</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 flex flex-row gap-4 items-center justify-start self-stretch shrink-0 h-23 relative shadow-lg">
                        <div className="flex flex-row gap-4 items-center justify-start flex-1 relative">
                            <div className="bg-[#3cb018] rounded-full flex flex-row gap-2.5 items-center justify-center shrink-0 w-10 h-10 relative shadow-sm">
                                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1 items-start justify-start flex-1 relative">
                                <div className="text-[#303030] text-left font-poppins text-sm font-bold self-stretch">AI-Powered Logistics</div>
                                <div className="text-[#303030]/70 text-left font-poppins text-sm leading-[19px] font-normal self-stretch">Ensure food is redistributed quickly and safely</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SustainaFoodSection;
