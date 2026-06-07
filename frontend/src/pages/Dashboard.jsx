import axios from 'axios';
import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DashboardGlobal = createGlobalStyle`
  @property --angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 135deg;
  }

  @property --s-o {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  @property --s-s {
    syntax: "<percentage>";
    inherits: true;
    initial-value: 400%;
  }
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 3rem 1.5rem;
  background-color: #111111;
  border: 4px solid #ffffff;
  box-shadow: 16px 16px 0px #000000;
  border-radius: 1.5rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 4rem;
    align-items: center;
    padding: 3rem 4rem;
  }

  @media (min-width: 1200px) {
    gap: 8rem;
    padding: 3rem 6rem;
  }



  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 50%,
      transparent 0%
    );
    background-size: 0.1875rem 0.1875rem;
    pointer-events: none;
  }

  /* --- INFO PANEL (LEFT SIDE) --- */
  .info-panel {
    position: relative;
    z-index: 10;
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    width: 100%;
    max-width: 450px;
    min-height: 260px;
  }

  .info-panel h2 {
    font-size: clamp(1rem, 2vw, 1.25rem);
    opacity: 0.8;
    margin: 0;
    font-weight: normal;
  }

  .info-panel h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    margin: 0;
    font-weight: bold;
    letter-spacing: -0.05em;
  }

  .info-panel p {
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    opacity: 0.7;
    margin: 0;
  }

  .info-panel .activity {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-panel .activity p {
    opacity: 0.9;
  }

  /* Panel content fade animation */
  .panel-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: panelFadeIn 0.35s ease forwards;
  }

  @keyframes panelFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Loading shimmer */
  .balance-loading {
    height: clamp(2.5rem, 5vw, 4.5rem);
    width: 60%;
    background: linear-gradient(90deg,
      rgba(255,255,255,0.05) 0%,
      rgba(255,255,255,0.12) 50%,
      rgba(255,255,255,0.05) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 0.5rem;
  }

  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  /* --- SEARCH BAR & CONTACTS --- */
  .search-bar {
    display: flex;
    align-items: center;
    background-image: 
      linear-gradient(135deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(225deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(45deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(315deg, rgb(0, 0, 0) 25%, transparent 25%);
    background-position: 5px 0px, 5px 0px, 0px 0px, 0px 0px;
    background-size: 10px 10px;
    background-repeat: repeat;
    background-color: #1b1b1b;
    border: 2px solid #ffffff;
    border-radius: 1rem;
    padding: 0.8em 1.2em;
    width: 100%;
    margin-top: 0.5rem;
    transition: all 0.15s ease;
    box-shadow: 4px 4px 0px #000000;
    cursor: text;
    box-sizing: border-box;
  }

  .search-bar:focus-within {
    border-color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0px #000000;
  }

  .search-bar input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.1em;
    width: 100%;
    margin-left: 0.8em;
    caret-color: #ffffff;
  }

  .search-bar input::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  .search-bar svg {
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
    transition: color 0.3s ease;
  }

  .search-bar:focus-within svg {
    color: #ffffff;
  }

  .quick-send-title {
    color: rgba(255,255,255,0.6);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 1.5em 0 0.8em;
  }

  .contacts-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
  }

  .quick-contact-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  .quick-contact-item:hover {
    transform: translateY(-4px);
  }

  .contact-avatar {
    width: 3.5em;
    height: 3.5em;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: #1b1b1b;
    border: 2px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 1.1em;
    box-shadow: 3px 3px 0px #000000;
    transition: all 0.15s ease;
  }

  .quick-contact-item:hover .contact-avatar {
    background-color: #ffffff;
    color: #000000;
    border-color: #000000;
    box-shadow: 4px 4px 0px #000000;
  }

  .contact-name {
    color: rgba(255, 255, 255, 0.6);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.8em;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.05em;
    transition: color 0.15s ease;
  }

  .quick-contact-item:hover .contact-name {
    color: #ffffff;
  }

  /* --- 3D FLIP CARD CONTAINER --- */
  .container {
    position: relative;
    perspective: 40rem;
    width: 100%;
    max-width: 450px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    transition: scale 0.1s;
    container-type: inline-size;
  }

  .container.tilt-active {
    scale: 1.05;
  }

  .card {
    position: relative;
    width: 100%;
    aspect-ratio: 1.58;
    font-size: clamp(11px, 3.5cqw, 20px);
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;

    --flip: 0deg;
    --x: 0;
    --y: 0;
    --r: 0deg;
    --s-o: 0;
    --s-s: 400%;
    --angle: 135deg;

    transform: rotateY(var(--flip)) rotate3d(var(--x), var(--y), 0, var(--r));
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  /* Tilt variants — applied via JS className */
  .card.tilt-tl  { --x: -1; --y:  1; --angle: 125deg; }
  .card.tilt-tr  { --x: -1; --y: -1; --angle: 130deg; }
  .card.tilt-bl  { --x:  1; --y:  1; --angle: 135deg; }
  .card.tilt-br  { --x:  1; --y: -1; --angle: 140deg; }

  .card.tilt-r-8 { --r: 8deg; }
  .card.tilt-r-4 { --r: 4deg; }
  .card.tilt-r-2 { --r: 2deg; }

  .card.holo-on  { --s-o: 0.5; --s-s: 100%; }

  .card.flipped  { --flip: 180deg; }

  /* Shared face styles */
  .card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(1px);
    -webkit-transform: translateZ(1px);
    border: 0.5em solid #fff;
    border-radius: 1.5em;
    box-shadow: 0 0 0 2px black, -1.25em 2.5em 0.625em 0 rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(135deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(225deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(45deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(315deg, rgb(0, 0, 0) 25%, transparent 25%);
    background-position: 10px 0px, 10px 0px, 0px 0px, 0px 0px;
    background-size: 20px 20px;
    background-repeat: repeat;
    background-color: #1b1b1b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* --- FRONT FACE --- */
  .card-front {
    transform: rotateY(0deg) translateZ(1px);
    z-index: 2;
  }

  .card-label {
    color: rgba(255, 255, 255, 0.5);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .card-top-left {
    position: absolute;
    top: 8%;
    left: 5%;
    display: flex;
    align-items: center;
    gap: 0.8em;
    z-index: 10;
  }

  .user-badge {
    width: 3em;
    height: 3em;
    background-color: #fff;
    color: #1b1b1b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 1.15em;
    text-transform: uppercase;
  }

  .card-username {
    color: rgba(255,255,255,0.9);
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.15em;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .card-balance-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    transform: translateY(-5%);
  }

  .card-balance {
    color: #fff;
    font-size: 4em;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
    margin-top: 0.1em;
    line-height: 1;
  }

  .card-bottom-left {
    position: absolute;
    bottom: 8%;
    left: 5%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 10;
  }

  .card-wallet-id {
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2em;
    letter-spacing: 0.15em;
    margin-top: 0.2em;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .brand-logo {
    position: absolute;
    top: 8%;
    right: 5%;
    color: #fff;
    font-family: Arial, sans-serif;
    font-weight: 800;
    font-size: 1.5em;
    letter-spacing: -0.05em;
    z-index: 10;
  }

  .send-money-text {
    position: absolute;
    bottom: 8%;
    right: 5%;
    color: #fff;
    font-size: 1.2em;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.1em;
    font-weight: bold;
    z-index: 10;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    transition: color 0.2s;
    user-select: none;
  }

  .card:hover .send-money-text {
    color: #e0e0e0;
  }

  /* --- HOLOGRAPHIC OVERLAY (replaces invalid <s> tag) --- */
  .holo-overlay {
    position: absolute;
    inset: 0;
    opacity: var(--s-o, 0);
    pointer-events: none;
    transition: opacity 0.6s ease, background-size 0.3s ease;
    background-size: var(--s-s, 400%);
    border-radius: 1.5em;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background-image: linear-gradient(
        var(--angle),
        rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25) 15%,
        rgba(255, 255, 255, 0.9) 20%, rgba(255, 255, 255, 0.9) 25%,
        rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.75) 100%
      ),
      linear-gradient(
        calc(var(--angle) - 180deg),
        rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 15%,
        rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.8) 25%,
        rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.3) 100%
      ),
      linear-gradient(
        var(--angle),
        rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15) 30%,
        rgba(255, 255, 255, 0.75) 33%, rgba(255, 255, 255, 0.75) 33%,
        rgba(255, 255, 255, 0.15) 35%, rgba(255, 255, 255, 0.25) 100%
      );
  }

  /* --- BACK FACE --- */
  .card-back {
    transform: rotateY(180deg) translateZ(1px);
    padding: 0 8%;
    z-index: 1;
  }

  .card-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .user-badge-large {
    width: 2em;
    height: 2em;
    background-color: #fff;
    color: #1b1b1b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 2em;
    margin-bottom: 0.5em;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  }

  .back-title {
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.8em;
    font-weight: bold;
    margin-bottom: 0.2em;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }

  .auth-badge {
    color: #22c55e;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85em;
    letter-spacing: 0.1em;
    margin-bottom: 1.5em;
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
  }

  .card-wallet-id {
    color: rgba(255,255,255,0.7);
    font-family: 'Courier New', Courier, monospace;
    font-size: 1em;
    letter-spacing: 0.1em;
  }

  .cancel-text {
    position: absolute;
    bottom: 8%;
    right: 5%;
    color: #fff;
    font-size: 1.2em;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.1em;
    font-weight: bold;
    z-index: 30;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    transition: color 0.2s;
    cursor: pointer;
    user-select: none;
  }

  .cancel-text:hover {
    color: #fca5a5;
  }

  /* --- SEARCH RESULTS LIST --- */
  .user-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    max-height: 260px;
    overflow-y: auto;
    margin-top: 1.2rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0.4rem 0.6rem 0.6rem 0.4rem;
  }

  .user-list::-webkit-scrollbar {
    width: 5px;
  }

  .user-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: 
      linear-gradient(135deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(225deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(45deg, rgb(0, 0, 0) 25%, transparent 25%),
      linear-gradient(315deg, rgb(0, 0, 0) 25%, transparent 25%);
    background-position: 5px 0px, 5px 0px, 0px 0px, 0px 0px;
    background-size: 10px 10px;
    background-repeat: repeat;
    background-color: #1b1b1b;
    border: 2px solid #ffffff;
    border-radius: 1rem;
    padding: 0.9rem 1.2rem;
    transition: all 0.15s ease;
    box-shadow: 0px 4px 0px #000000;
    box-sizing: border-box;
  }

  .user-item:hover {
    border-color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0px 6px 0px #000000;
  }

  .user-item:active {
    transform: translateY(2px);
    box-shadow: 0px 2px 0px #000000;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-name {
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 1rem;
    text-shadow: 1px 1px 0px #000;
  }

  .user-handle {
    color: rgba(255, 255, 255, 0.65);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.8rem;
    margin-top: 0.1rem;
    text-shadow: 1px 1px 0px #000;
  }

  .send-button {
    background: #ffffff;
    color: #000000;
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px #000000;
    border-radius: 0.5rem;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 0.85em;
    padding: 0.4rem 1rem;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .send-button:hover {
    background: #000000;
    color: #ffffff;
    border-color: #ffffff;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px #000000;
  }

  .send-button:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px #000000;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.25s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-image: 
    linear-gradient(135deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(225deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(45deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(315deg, rgb(0, 0, 0) 25%, transparent 25%);
  background-position: 10px 0px, 10px 0px, 0px 0px, 0px 0px;
  background-size: 20px 20px;
  background-repeat: repeat;
  background-color: #1b1b1b;
  border: 3px solid #ffffff;
  border-radius: 1.5rem;
  padding: 2.5rem;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  box-shadow: 0px 10px 0px #000000, 0px 20px 50px rgba(0,0,0,0.5);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 2px 2px 0px #000;
`;

const UserHandle = styled.span`
  color: rgba(255, 255, 255, 0.65);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  margin-top: 0.1rem;
  text-shadow: 1px 1px 0px #000;
  display: block;
`;

const AmountInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid #ffffff;
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
  box-shadow: 4px 4px 0px #000000;
  box-sizing: border-box;
`;

const AmountSymbol = styled.span`
  color: #ffffff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 2.2rem;
  font-weight: bold;
  margin-right: 0.4rem;
  text-shadow: 2px 2px 0px #000;
  user-select: none;
`;

const AmountInput = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 2.2rem;
  font-weight: bold;
  width: 100%;
  outline: none;
  caret-color: #ffffff;
  text-shadow: 2px 2px 0px #000;

  &::placeholder {
    color: rgba(255, 255, 255, 0.15);
  }
`;

const ConfirmButton = styled.button`
  width: 100%;
  background: #ffffff;
  color: #000000;
  border: 2px solid #000000;
  box-shadow: 4px 4px 0px #000000;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1.15rem;
  padding: 1.1rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #000000;
    color: #ffffff;
    border-color: #ffffff;
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0px #000000;
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 1px 1px 0px #000000;
  }
`;

const CancelBtn = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  border: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s ease;
  text-shadow: 1px 1px 0px #000;

  &:hover {
    color: #ff8a8a;
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  border: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    color: #ff8a8a;
    text-decoration: underline;
  }
`;

// Maps grid cell index (0-based) → tilt classes
// Mirrors original CSS logic: quadrant + corner/edge rotation
const TILT_MAP = {
  0:  ['tilt-tl', 'tilt-r-8'],
  1:  ['tilt-tl', 'tilt-r-4'],
  2:  ['tilt-tr', 'tilt-r-4'],
  3:  ['tilt-tr', 'tilt-r-8'],
  4:  ['tilt-tl', 'tilt-r-4'],
  5:  ['tilt-tl', 'tilt-r-2'],
  6:  ['tilt-tr', 'tilt-r-2'],
  7:  ['tilt-tr', 'tilt-r-4'],
  8:  ['tilt-bl', 'tilt-r-4'],
  9:  ['tilt-bl', 'tilt-r-2'],
  10: ['tilt-br', 'tilt-r-2'],
  11: ['tilt-br', 'tilt-r-4'],
  12: ['tilt-bl', 'tilt-r-8'],
  13: ['tilt-bl', 'tilt-r-4'],
  14: ['tilt-br', 'tilt-r-4'],
  15: ['tilt-br', 'tilt-r-8'],
};

// Back face is rotated 180° on Y, so left↔right quadrants are visually mirrored.
// Swap tl↔tr and bl↔br so the tilt still feels natural when interacting.
const TILT_MAP_FLIPPED = {
  0:  ['tilt-tr', 'tilt-r-8'],
  1:  ['tilt-tr', 'tilt-r-4'],
  2:  ['tilt-tl', 'tilt-r-4'],
  3:  ['tilt-tl', 'tilt-r-8'],
  4:  ['tilt-tr', 'tilt-r-4'],
  5:  ['tilt-tr', 'tilt-r-2'],
  6:  ['tilt-tl', 'tilt-r-2'],
  7:  ['tilt-tl', 'tilt-r-4'],
  8:  ['tilt-br', 'tilt-r-4'],
  9:  ['tilt-br', 'tilt-r-2'],
  10: ['tilt-bl', 'tilt-r-2'],
  11: ['tilt-bl', 'tilt-r-4'],
  12: ['tilt-br', 'tilt-r-8'],
  13: ['tilt-br', 'tilt-r-4'],
  14: ['tilt-bl', 'tilt-r-4'],
  15: ['tilt-bl', 'tilt-r-8'],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance]     = useState(null); // null = loading
  const [userName, setUserName]   = useState('');
  const [last4, setLast4]         = useState('0000');
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState(""); // "", "success", "error"

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Form");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUsers(response.data.user || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    if (filter) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [filter]);

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/v1/account/transfer", {
        to: selectedUser._id,
        amount: Number(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTransferStatus("success");
      setBalance((prev) => prev - Number(amount));
      setTimeout(() => {
        setSelectedUser(null);
        setAmount("");
        setTransferStatus("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setTransferStatus("error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // For UI testing without a backend, uncomment:
        // setBalance(12450.00); setUserName('Robert'); setLast4('4281');
        setBalance(0);
        return;
      }

      try {
        // Fire both requests in parallel
        const [userRes, balanceRes] = await Promise.all([
          axios.get('http://localhost:3000/api/v1/user/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/api/v1/account/balance', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserName(userRes.data.username || '');
        setBalance(balanceRes.data.balance ?? 0);
        setLast4(balanceRes.data.idLast4 || '0000');
      } catch (err) {
        console.error('Data fetch failed', err);
        setBalance(0);
      }
    };

    fetchData();
  }, []);

  const userInitial = userName?.[0]?.toUpperCase() ?? 'U';
  const isLoading   = balance === null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const tiltClasses = activeIndex !== -1
    ? ['holo-on', ...((isFlipped ? TILT_MAP_FLIPPED : TILT_MAP)[activeIndex] ?? [])]
    : [];

  const cardClassName = [
    'card',
    isFlipped ? 'flipped' : '',
    ...tiltClasses,
  ].filter(Boolean).join(' ');

  const isTilting = tiltClasses.length > 0;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x / rect.width) * 4);
    const row = Math.floor((y / rect.height) * 4);

    const clampedCol = Math.max(0, Math.min(3, col));
    const clampedRow = Math.max(0, Math.min(3, row));
    const index = clampedRow * 4 + clampedCol;

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-transparent'>
      <DashboardGlobal />
      <DashboardWrapper className="w-[90vw] max-w-[1250px] min-h-[85vh]">
        <LogoutButton onClick={handleLogout}>LOGOUT ⎋</LogoutButton>

        {/* --- LEFT PANEL --- */}
        <div className="info-panel">
          {!isFlipped ? (
            <div className="panel-content" key="front-panel">
              <h2>Available Balance</h2>
              {isLoading
                ? <div className="balance-loading" />
                : <h1>{formatCurrency(balance)}</h1>
              }
              <p>Wallet ID: •••• {last4}</p>

              <div className="activity">
                <h2>Recent Activity</h2>
                <p style={{ color: '#22c55e' }}>+ $500.00 (Deposit)</p>
                <p style={{ color: '#ef4444' }}>- $12.50 (Coffee)</p>
                <p style={{ color: '#ef4444' }}>- $89.99 (Groceries)</p>
              </div>
            </div>
          ) : (
            <div className="panel-content" key="back-panel">
              <h1>Transfer Funds</h1>
              <p>Search securely using our encrypted network.</p>

              <div className="search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter @handle or ID..."
                  spellCheck="false"
                  autoComplete="off"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Render search results if filter is active */}
              {filter && users.length > 0 && (
                <div className="user-list">
                  {users.map((user) => (
                    <div className="user-item" key={user._id}>
                      <div className="user-info">
                        <div className="contact-avatar" style={{ width: '2.5rem', minWidth: '2.5rem', height: '2.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {user.firstName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user.firstName} {user.lastName}</span>
                          <span className="user-handle">@{user.username}</span>
                        </div>
                      </div>
                      <button className="send-button" onClick={() => setSelectedUser(user)}>
                        Send
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {filter && users.length === 0 && (
                <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'Courier New', marginTop: '1.2rem', fontSize: '0.95rem', fontStyle: 'italic', textAlign: 'left', width: '100%' }}>
                  No users found matching "{filter}"
                </div>
              )}

              {!filter && (
                <>
                  <div className="quick-send-title">Quick Send</div>
                  <div className="contacts-row" style={{ justifyContent: 'flex-start', gap: '1.2rem' }}>
                    {[
                      { name: 'Alice', initial: 'A' },
                      { name: 'John',  initial: 'J' },
                      { name: 'Sarah', initial: 'S' },
                      { name: 'Mike',  initial: 'M' },
                      { name: 'Kate',  initial: 'K' }
                    ].map((contact, i) => (
                      <div className="quick-contact-item" key={i} onClick={() => setSelectedUser({ firstName: contact.name, username: contact.name.toLowerCase(), _id: 'mock_id' })}>
                        <div className="contact-avatar">{contact.initial}</div>
                        <div className="contact-name">{contact.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: INTERACTIVE 3D CARD --- */}
        <div
          className={`container${isTilting ? ' tilt-active' : ''}`}
          onClick={() => !isFlipped && setIsFlipped(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className={cardClassName}>

            {/* FRONT FACE */}
            <div className="card-face card-front">
              {/* Top Left: User Info (Only initials badge) */}
              <div className="card-top-left">
                <div className="user-badge">{userInitial}</div>
              </div>

              {/* Top Right: Brand */}
              <div className="brand-logo">paytm</div>

              {/* Center: Giant Dollar Sign */}
              <div className="card-balance-wrapper" style={{ transform: 'none' }}>
                <div className="card-balance" style={{ fontSize: '6.5em', marginTop: 0 }}>$</div>
              </div>

              {/* Bottom Right: Action Text */}
              <div className="send-money-text">SEND MONEY ➔</div>

              <div className="holo-overlay" />
            </div>

            {/* BACK FACE */}
            <div className="card-face card-back">
              {/* Top Left: User Info */}
              <div className="card-top-left">
                <div className="user-badge">{userInitial}</div>
                <div className="card-username">@{userName || 'loading...'}</div>
              </div>

              {/* Top Right: Brand */}
              <div className="brand-logo">paytm</div>

              {/* Center: Live Balance */}
              <div className="card-balance-wrapper">
                <div className="card-label">Current Balance</div>
                <div className="card-balance">{isLoading ? '...' : formatCurrency(balance)}</div>
              </div>

              {/* Bottom Left: Secure Connection */}
              <div className="card-bottom-left" style={{ bottom: '8%', left: '5%' }}>
                <div className="auth-badge" style={{ marginBottom: 0 }}>✓ SECURE CONNECTION</div>
              </div>

              <div
                className="cancel-text"
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              >
                CANCEL ↺
              </div>
            </div>

          </div>
        </div>

      </DashboardWrapper>

      {/* Transfer Money Modal overlay */}
      {selectedUser && (
        <ModalOverlay onClick={() => { setSelectedUser(null); setAmount(""); setTransferStatus(""); }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Send to {selectedUser.firstName}</ModalTitle>
            <UserHandle style={{ marginBottom: '1rem' }}>@{selectedUser.username}</UserHandle>
            
            <AmountInputContainer>
              <AmountSymbol>$</AmountSymbol>
              <AmountInput
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </AmountInputContainer>

            {transferStatus === "success" && (
              <div style={{ color: '#22c55e', fontFamily: 'Courier New', fontWeight: 'bold' }}>
                ✓ Transfer Successful!
              </div>
            )}
            {transferStatus === "error" && (
              <div style={{ color: '#ef4444', fontFamily: 'Courier New', fontWeight: 'bold' }}>
                ✗ Insufficient balance or transaction failed
              </div>
            )}

            <ConfirmButton onClick={handleTransfer}>
              Confirm & Transfer
            </ConfirmButton>
            <CancelBtn onClick={() => { setSelectedUser(null); setAmount(""); setTransferStatus(""); }}>
              Cancel
            </CancelBtn>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}