// ==UserScript==
// @name         Flying Kawarage Texts For Google Search
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds flying texts to the page with a Kawarage theme.
// @author       Kawarage
// @match        https://www.google.com/search?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const phrases = [
        "kawarage?.()",
        "ofNullable(this) -> kawarage());",
        "class Kawarage();",
        "self.kawarage()",
        "this.kawarage();",
        "zimo.kawarage",
        "https://kawarage.tk",
        "this?.kawarage();",
        "startKawarage();",
        "public void getKawarage();",
        "(this ? kawarage() : void());",
        "if true { kawarage() }",
        "kawarage-zimo",
        "true ? kawarage() : null;",
        "Option(this).foreach(_ => kawarage())",
        "kawarage() ?? print('Failed');",
        "kawarage!()"
    ];

    const lastPositions = [];
    const minDistance = 12;

    function setDynamicInterval() {
        clearInterval(intervalId);
        clearExistingTexts();

        const windowWidth = window.innerWidth;
        const newInterval = 60000 / windowWidth;

        intervalId = setInterval(addText, newInterval);
    }

    let intervalId;
    let currentFontSize;

    function startFlyingTexts() {
        currentFontSize = getRootFontSize();
        setDynamicInterval();
        window.addEventListener('resize', setDynamicInterval);
    }

    function getRootFontSize() {
        return parseInt(getComputedStyle(document.documentElement).fontSize, 10);
    }

    function randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomPhrase() {
        return phrases[randomIntFromRange(0, phrases.length - 1)];
    }

    function isTooClose(newPosition) {
        return lastPositions.some(oldPosition => Math.abs(newPosition - oldPosition) < minDistance);
    }

    function clearExistingTexts() {
        const floatingTexts = document.querySelectorAll('.flying-kawarage');
        floatingTexts.forEach(el => el.remove());
    }

    function addText() {
        const leftPosition = randomIntFromRange(-10, 100);

        if (isTooClose(leftPosition)) {
            lastPositions.shift();
            return;
        }

        if (lastPositions.length >= 8) {
            lastPositions.shift();
        }
        lastPositions.push(leftPosition);

        let newFontSize = currentFontSize - 3;
        let newSpeed = newFontSize / currentFontSize;
        let textOpacity = 6;

        const textDiv = document.createElement("div");
        const shadowIndex = randomIntFromRange(1, 3);

        const shadowAdjustments = [
            { fontSize: 2, speed: 14, opacity: 4 },
            { fontSize: 2, speed: 16, opacity: 10 },
            { fontSize: 2, speed: 19, opacity: 16 }
        ];

        const adjust = shadowAdjustments[shadowIndex - 1];
        newFontSize += randomIntFromRange(1, adjust.fontSize);
        newSpeed *= randomIntFromRange(13, adjust.speed);
        textOpacity += randomIntFromRange(0, adjust.opacity);

        textDiv.innerHTML = getRandomPhrase();
        textDiv.className = "flying-kawarage";
        textDiv.style.cssText = `
            position: fixed;
            transform: rotate(-90deg);
            z-index: -200;
            color: black;
            font-weight: bold;
            white-space: nowrap;
            left: ${leftPosition}%;
            bottom: ${-randomIntFromRange(80, 120)}vh;
            transition: bottom ${newSpeed}s linear;
            opacity: ${textOpacity / 100};
            width: 0.001rem;
            height: 0.001rem;
            font-size: ${newFontSize}px;
            box-shadow: ${shadowIndex === 1 ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'};
        `;

        document.body.appendChild(textDiv);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                textDiv.style.bottom = "140vh";
            });
        });

        setTimeout(() => {
            textDiv.remove();
        }, (newSpeed + 1) * 1000);

        currentFontSize = newFontSize;
    }

    startFlyingTexts();
})();
