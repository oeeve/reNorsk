// reNorsk Extension - Service Worker for Manifest V3
// Corrects Norwegian text on active website where synthetically constructed debasements or knockoffs (often varians of radical nynorsk) has been applied.

// Correction of the active tab
async function executeCorrection() {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab) {
      await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: pageScript
      });
      console.log('reNorsk: Language correction executed successfully on', tab.url);
    }
  } catch (error) {
    console.error('reNorsk: Error executing correction:', error);
    
    // Show error notification if possible
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'reNorsk',
        message: 'Rettingen ble ikke gjennomført :( Det er mulig siden du er på ikke er støttet.'
      });
    }
  }
}

// Keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "correct_page") {
    console.log('reNorsk: Keyboard shortcut triggered');
    await executeCorrection();
  }
});

// Extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  console.log('reNorsk: Extension icon clicked');
  await executeCorrection();
});

// Content script function (injected into the webpage)
function pageScript() {
    console.log('reNorsk: Correction script started');
    
    // Configuration
    const MAX_CONCURRENT = 20; // Maximum concurrent API calls to prevent overwhelming the API
    
    // Store reference to indicator element
    let indicatorElement = null;
    let totalNodes = 0;
    let processedNodes = 0;
    
    // Progress indicator (visual)
    function showCorrectionIndicator(total) {
        totalNodes = total;
        processedNodes = 0;
        
        // Remove any existing indicator
        const existing = document.getElementById('reNorsk-indicator');
        if (existing) existing.remove();
        
        indicatorElement = document.createElement('div');
        indicatorElement.id = 'reNorsk-indicator';
        indicatorElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="reNorsk-spinner">🇳🇴</span>
                <span class="reNorsk-text">reNorsk retter...</span>
                <span class="reNorsk-progress">0/${totalNodes}</span>
            </div>
        `;
        indicatorElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #8BBCD2;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        // Spinner (animation)
        const existingStyle = document.getElementById('reNorsk-style');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'reNorsk-style';
            style.textContent = `
                @keyframes reNorsk-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                #reNorsk-indicator .reNorsk-spinner {
                    display: inline-block;
                    animation: reNorsk-spin 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(indicatorElement);
    }
    
    // Progress update
    function updateProgress() {
        processedNodes++;
        if (indicatorElement) {
            const progressElement = indicatorElement.querySelector('.reNorsk-progress');
            if (progressElement) {
                progressElement.textContent = `${processedNodes}/${totalNodes}`;
            }
            
            // Check if complete
            if (processedNodes >= totalNodes) {
                setTimeout(() => {
                    if (indicatorElement) {
                        indicatorElement.querySelector('.reNorsk-text').textContent = 'Retting fullført! 🎉';
                        indicatorElement.querySelector('.reNorsk-spinner').textContent = '🎉';
                        indicatorElement.style.background = '#B5DAC0';
                        
                        setTimeout(() => {
                            if (indicatorElement && indicatorElement.parentNode) {
                                indicatorElement.style.opacity = '0';
                                setTimeout(() => {
                                    if (indicatorElement && indicatorElement.parentNode) {
                                        indicatorElement.parentNode.removeChild(indicatorElement);
                                    }
                                }, 300);
                            }
                        }, 1500);
                    }
                }, 100);
            }
        }
    }
    
    // Correction (Translation) function
    async function correctText(textNode) {
        try {
            const originalText = textNode.nodeValue;
            const text = originalText.trim();
            
            // Skip very short or non-text content
            if (text.length < 2 || text.length > 500 || !/[a-zA-ZæøåÆØÅ]/.test(text)) {
                return;
            }
            
            const url = `https://www.apertium.org/apy/translate?q=${encodeURIComponent(text)}&langpair=nno|nob`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.responseData && data.responseData.translatedText) {
                const translatedText = data.responseData.translatedText.replace(/\*/g, '');
                if (translatedText !== text) {
                    // Preserve original whitespace (spaces, tabs, newlines) at the beginning and end
                    const leadingWhitespace = originalText.match(/^\s*/)[0];
                    const trailingWhitespace = originalText.match(/\s*$/)[0];
                    textNode.nodeValue = leadingWhitespace + translatedText + trailingWhitespace;
                    console.log(`reNorsk: Rettet "${text.substring(0, 30)}..."`);
                }
            }
        } catch (error) {
            console.error('reNorsk: Error :(', error);
        } finally {
            updateProgress();
        }
    }
    
    // Process segments of text nodes
    async function processChunk(nodes) {
        const promises = nodes.map(node => correctText(node));
        await Promise.allSettled(promises);
    }
    
    // Get all text nodes
    function getAllTextNodes() {
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    
                    // Skip script, style, and input elements
                    const tagName = parent.tagName;
                    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'].includes(tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // Skip if parent is contenteditable
                    if (parent.contentEditable === 'true') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // Skip if parent is hidden
                    const style = getComputedStyle(parent);
                    if (style.display === 'none' || style.visibility === 'hidden') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // Only process nodes with meaningful text
                    const text = node.nodeValue.trim();
                    if (text.length > 2 && /[a-zA-ZæøåÆØÅ]/.test(text)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        return textNodes;
    }
    
    // Main Correction function
    async function correctPage() {
        console.log('reNorsk: Starting language corrections');
        
        // Get all text nodes
        const textNodes = getAllTextNodes();
        totalNodes = textNodes.length;
        
        console.log(`reNorsk: Fant ${totalNodes} tekstnoder`);
        
        if (totalNodes === 0) {
            console.log('reNorsk: No text nodes found to correct');
            return;
        }
        
        // Show indicator
        showCorrectionIndicator(totalNodes);
        
        // Segment workload to prevent resource saturation
        for (let i = 0; i < textNodes.length; i += MAX_CONCURRENT) {
            const chunk = textNodes.slice(i, i + MAX_CONCURRENT);
            await processChunk(chunk);
            
            // Throttling to respect API rate limits
            if (i + MAX_CONCURRENT < textNodes.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        console.log('reNorsk: Retting fullført!');
    }
    
    // Start correction immediately
    correctPage();
}