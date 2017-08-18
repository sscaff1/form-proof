import React from 'react';

export default function Button({ className, ...props }) {
  return (
    <div>
      <a href="#" {...props}>
        Proceed To Payment
      </a>
      <style jsx>{`
        a {
          border: 0;
          border-radius: 0;
          background: #b60610;
          color: #fff;
          outline: none;
          padding: 1em 1.2em;
          position: relative;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
        }
        a:hover {
          background: #d00;
        }
        a.disabled {
          background: #ccc;
          cursor: default;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
