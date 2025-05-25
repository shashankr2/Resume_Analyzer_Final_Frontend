import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-semibold">ResumeAI</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Powerful AI-driven resume analysis to help you land your dream job.
            </p>
            <div className="flex space-x-4 mt-6">
              <SocialLink icon={<Twitter size={20} />} href="https://twitter.com" />
              <SocialLink icon={<Github size={20} />} href="https://github.com" />
              <SocialLink icon={<Linkedin size={20} />} href="https://linkedin.com" />
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FooterColumn title="Product">
              <FooterLink href="/analyze">Resume Analysis</FooterLink>
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </FooterColumn>

            <FooterColumn title="Resources">
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/guides">Resume Guides</FooterLink>
              <FooterLink href="/examples">Resume Examples</FooterLink>
            </FooterColumn>

            <FooterColumn title="Company">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterColumn>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterLink href="/privacy" className="text-sm text-gray-500 hover:text-gray-300">
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" className="text-sm text-gray-500 hover:text-gray-300">
              Terms of Service
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
  >
    {icon}
  </a>
);

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <ul className="space-y-3">{children}</ul>
  </div>
);

interface FooterLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, className, children }) => (
  <li>
    <a
      href={href}
      className={`text-gray-400 hover:text-blue-400 transition-colors duration-300 ${className || ''}`}
    >
      {children}
    </a>
  </li>
);

export default Footer;