import InstagramIcon from '@/components/icons/InstagramIcon'
import TwitterIcon from '@/components/icons/TwitterIcon'
import { HoPLocations, ProjectTypes } from '@/lib/consts'
import Link from 'next/link'
import HopLogo from './icons/HopLogo'

const Footer = () => {
  return (
    <footer className="w-full px-0 md:px-16">
      <div className="border-t border-b border-[#D4D5D7] w-full flex flex-col md:grid md:grid-cols-3 gap-4 lg:gap-24 py-4 lg:py-10">
        <div className="px-4 md:px-0">
          <div className="mb-6">
            <HopLogo />
          </div>
          <p className="text-secondary text-base">
            House of Panda is an NFT-based real estate investment platform that
            gives you access to yield, short-term loans. Backed by experts
            with years of experience, our goal is to make NFTs & Real estate
            financing easier & accessible for everyone.
          </p>
        </div>
        <div className="col-span-2 px-4 md:px-0 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h1 className="text-secondary font-bold text-lg mb-4">Location</h1>
            <ul className="flex flex-col gap-2 text-secondary text-base">
              {HoPLocations.map((item, i) => (
                <li key={i}>
                  <Link href={item.to}>
                    <a className="hover:underline transition-all ease-in-out hover:text-primary">
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="text-secondary font-bold text-lg mb-4">
              Type Properties
            </h1>
            <ul className="flex flex-col gap-2 text-secondary text-base">
              {ProjectTypes.map((ty, id) => (
                <li key={id}>
                  <Link href={`/project/explore?propertyType=${id}`}>
                    <a className="hover:text-primary hover:underline">{ty}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="text-secondary font-bold text-lg mb-4">About Us</h1>
            <ul className="flex flex-col gap-2 text-secondary text-base">
              <li>
                <Link href="/about-us">
                  <a className="hover:underline transition-all ease-in-out hover:text-primary">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about-us#contact">
                  <a className="hover:underline transition-all ease-in-out hover:text-primary">
                    Contact Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <a className="hover:underline transition-all ease-in-out hover:text-primary">
                    Privacy & Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms-and-condition">
                  <a className="hover:underline transition-all ease-in-out hover:text-primary">
                    Terms & Condition
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="hover:underline transition-all ease-in-out hover:text-primary">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between items-center py-6 px-4 md:px-0">
        <div className="text-center lg:text-left">
          <p>IGMX International PTE.LTD (m.k.al) 2023 </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-secondary">Follow us</div>
          <div className="flex gap-2 items-center">
            <a
              href="https://twitter.com/Houseof_Panda"
              target="_blank"
              rel="noreferrer"
              title='Twitter: @Houseof_Panda'
            >
              <TwitterIcon />
            </a>
            <a
              href="https://www.instagram.com/houseofpanda.co/"
              title='Instagram: @houseofpanda.co'
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
