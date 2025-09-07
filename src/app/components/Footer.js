'use client';

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 dark:bg-base-300 text-base-content dark:text-base-content">
      <div>
        <div className="grid grid-flow-col gap-4">
          <a href="/about" className="link link-hover">About</a>
          <a href="/contact" className="link link-hover">Contact</a>
          <a href="/privacy" className="link link-hover">Privacy Policy</a>
        </div>
        <p>Copyright © {new Date().getFullYear()} - All Rights Reserved</p>
      </div>
    </footer>
  );
}