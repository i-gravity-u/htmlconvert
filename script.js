    function wrapSelection(tag) {
      document.execCommand(tag === 'b' ? 'bold' : 'italic', false, null);
    }

    function applyColor() {
      const color = document.getElementById('colorPicker').value;
      document.execCommand('foreColor', false, color);
    }

    function setAlign(align) {
      document.execCommand('justify' + align);
    }

    function convertToHTML() {
      const editor = document.getElementById('editor');
      const temp = document.createElement('div');
      temp.innerHTML = editor.innerHTML;

      const paragraphs = [];
      let currentParagraph = '';
      let lastAlign = '';

      // <div>, <br> 등을 줄바꿈으로 인식
      const children = Array.from(temp.childNodes);
      children.forEach((node, i) => {
        if (node.nodeType === 1 && (node.tagName === 'DIV' || node.tagName === 'P')) {
          const content = node.innerHTML.trim();
          const align = node.style.textAlign || getComputedStyle(node).textAlign;

          // ---를 <div class="align">로 변환
      if (content === '---') {
        paragraphs.push(
          `<div class="align">
  <span class="dots"></span> <span class="dots"></span> <span class="dots"></span>
</div>`
        );
      } else if (content === '') {
        paragraphs.push('<p>&nbsp;</p>');
      } else {
        const style = align && align !== 'start' ? ` style="text-align:${align}"` : '';
        paragraphs.push(`<p${style}>${content}</p>`);
      }
        } else if (node.nodeType === 3 && node.textContent.trim() !== '') {
          paragraphs.push(`<p>${node.textContent.trim()}</p>`);
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
