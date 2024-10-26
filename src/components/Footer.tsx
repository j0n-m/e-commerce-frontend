import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";

function Footer() {
  return (
    <footer className="px-8 py-14 bg-gray-800 text-neutral-100">
      <div className="footer-content flex flex-col gap-4 text-center lg:gap-0 lg:flex-row justify-evenly lg:text-start border-b border-neutral-500 pb-10">
        <div className="customer-service">
          <p className="font-bold">Customer Service</p>
          <ul className="text-sm mt-2 flex flex-col gap-2">
            <li>Help Center</li>
            <li>Track an Order</li>
            <li>Return an order</li>
            <li>Provide Feedback</li>
            <li>Return Policy</li>
            <li>Privacy & Security</li>
          </ul>
        </div>
        <div className="resources">
          <p className="font-bold">Tools & Resources</p>
          <ul className="text-sm mt-2 flex flex-col gap-2">
            <li>About Cyber Den</li>
            <li>Become a seller</li>
            <li>Hours & Location</li>
            <li>Careers</li>
          </ul>
        </div>
        <div className="contact">
          <p className="font-bold">Contact Us</p>
          <ul className="text-sm mt-2 flex flex-col gap-2">
            <li>support@cyberden.com</li>
          </ul>
          <div className="brand-logos flex gap-2 items-center justify-evenly mt-6 lg:mt-2">
            <IconBrandX stroke={1.25} width={30} height={30}></IconBrandX>
            <IconBrandInstagram stroke={1.25} width={30} height={30} />
            <IconBrandFacebook stroke={1.25} width={30} height={30} />
            <IconBrandTiktok stroke={1.25} width={30} height={30} />
          </div>
        </div>
      </div>
      <div className="me flex justify-around py-6 text-sm text-neutral-400">
        <p className="flex flex-col">
          <span>Cyber Den is a made up website.</span>
          <span>All "payments" are not real.</span>
        </p>
        <p>&copy; 2024 Jon Monarrez</p>
      </div>
    </footer>
  );
}

export default Footer;
