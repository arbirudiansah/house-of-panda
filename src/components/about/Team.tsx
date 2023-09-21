/* eslint-disable @next/next/no-img-element */
import { faker } from '@faker-js/faker';
import { SocialIcon } from 'react-social-icons';
import OnViewTransition, { variant } from '../animations/OnViewTransition';

const Team = () => {
    const generateTeam = () => {
        const username = faker.internet.userName()

        return {
            fullName: faker.name.fullName(),
            avatar: faker.internet.avatar(),
            job: faker.name.jobType(),
            socials: [
                {
                    name: 'facebook',
                    url: 'https://www.facebook.com/' + username,
                },
                {
                    name: 'instagram',
                    url: 'https://www.instagram.com/' + username,
                },
                {
                    name: 'twitter',
                    url: 'https://twitter.com/@' + username,
                }
            ]
        }
    }

    return (
        <div className="py-4 lg:py-16 flex flex-col lg:grid lg:grid-cols-5 px-4 lg:px-0">
            <div className="col-span-1 lg:pr-8 py-4 text-center lg:text-left">
                <OnViewTransition variants={variant.fadeInRight}>
                    <h1 className="text-3xl font-semibold text-secondary">Meet Our Leadership Team</h1>
                    <p className="text-base mt-3 text-gray-500">{faker.lorem.sentence(16)}</p>
                </OnViewTransition>
            </div>
            <div className="col-span-4 relative">
                <div className="grid grid-col lg:grid-cols-5 gap-5 items-start px-6 lg:px-0">
                    {[...Array(5)].map((i, idx) => {
                        const item = generateTeam()
                        return (
                            <OnViewTransition key={`team-${idx}`} transition={{ delay: 0.6 + (idx / 10) }}>
                                <div className="bg-white transition-all ease-in-out rounded-lg shadow-md hover:shadow-lg w-full h-full overflow-hidden">
                                    <div className="flex justify-center triangle-topleft py-8 mb-4 lg:mb-0">
                                        <img src={item.avatar} alt={item.fullName} className="w-40 h-40 rounded-full object-cover border-4 border-secondary" />
                                    </div>
                                    <div className="px-6 py-2 pb-8 flex flex-col gap-4 text-center">
                                        <div>
                                            <h1 className="text-lg font-semibold text-secondary">{item.fullName}</h1>
                                            <h3 className="text-base font-medium text-gray-500">{item.job}</h3>
                                        </div>
                                        <div className="inline-flex space-x-2 items-center justify-center">
                                            {item.socials.map((i, idx) => (
                                                <SocialIcon
                                                    key={`sc-${idx}`}
                                                    network={i.name}
                                                    url={i.url}
                                                    style={{ width: 24, height: 24 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </OnViewTransition>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Team;