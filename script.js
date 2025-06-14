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

      // 빈 줄이거나 <br>만 있는 경우 처리
      if (content === '' || content.toLowerCase() === '<br>') {
        paragraphs.push('<p><br></p>');
        return;
      }

      // --- 처리
      if (content === '---') {
        paragraphs.push(`
<div class="align">
  <span class="dots"></span> <span class="dots"></span> <span class="dots"></span>
</div>`);
        return;
      }

      // 일반 문단 내용
      const lines = content.split(/<br\s*\/?>/i);
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed) {
          const style = align && align !== 'start' ? ` style="text-align:${align}"` : '';
          if (trimmed === '---') {
            paragraphs.push(`
<div class="align">
  <span class="dots"></span> <span class="dots"></span> <span class="dots"></span>
</div>`);
          } else {
            paragraphs.push(`<p${style}>${trimmed}</p>`);
          }
        } else {
          paragraphs.push('<p><br></p>');  // 빈 줄도 p로 처리
        }
      });

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
