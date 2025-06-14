function wrapSelection(tag) {
  document.execCommand(tag === 'b' ? 'bold' : 'italic', false, null);
}

function applyColor() {
  const color = document.getElementById('colorPicker').value;
  document.execCommand('foreColor', false, color);
}

function setAlign(align) {
  // 먼저 선택된 영역을 <p>로 감싸고 정렬 적용
  document.execCommand('formatBlock', false, 'p');
  document.execCommand('justify' + align);
}

function convertToHTML() {
  const editor = document.getElementById('editor');
  const temp = document.createElement('div');
  temp.innerHTML = editor.innerHTML;

  const paragraphs = [];
  const children = Array.from(temp.childNodes);

  children.forEach((node) => {
    if (node.nodeType === 1 && (node.tagName === 'DIV' || node.tagName === 'P')) {
      const content = node.innerHTML.trim();
      const align = node.style.textAlign || getComputedStyle(node).textAlign;

      if (content === '---') {
        paragraphs.push(`
<div class="align">
  <span class="dots"></span> <span class="dots"></span> <span class="dots"></span>
</div>`);
      } else if (content === '') {
        paragraphs.push('<p>&nbsp;</p>');
      } else {
        // <br> 기준으로 잘라 여러 줄 문단으로 나눔
        const lines = content.split(/<br\s*\/?>/i);
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed) {
            const style = align && align !== 'start' ? ` style="text-align:${align}"` : '';
            // --- 포함된 줄 처리
            if (trimmed === '---') {
              paragraphs.push(`
<div class="align">
  <span class="dots"></span> <span class="dots"></span> <span class="dots"></span>
</div>`);
            } else {
              paragraphs.push(`<p${style}>${trimmed}</p>`);
            }
          }
        });
      }

    } else if (node.nodeType === 3 && node.textContent.trim() !== '') {
      const text = node.textContent.trim();
      if (text === '---') {
        paragraphs.push(`
<div class="align">
  <span class="dots"></span> <span class="dots"></span> <span class="dots"></span>
</div>`);
      } else {
        paragraphs.push(`<p>${text}</p>`);
      }
    }
  });

  document.getElementById('result').textContent = paragraphs.join('\n');
}

function copyHTML() {
  const html = document.getElementById('result').textContent;
  navigator.clipboard.writeText(html).then(() => {
    const btn = document.getElementById('copyBtn');
    const original = btn.textContent;
    btn.textContent = '✅ 복사됨!';
    setTimeout(() => btn.textContent = original, 1500);
  }).catch(err => {
    alert('복사 실패: ' + err);
  });
}
