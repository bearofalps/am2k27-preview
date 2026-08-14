const briefForm = document.querySelector('[data-brief-form]');
const briefFields = briefForm ? [...briefForm.elements].filter((field) => field.name) : [];
const briefOutput = document.querySelector('[data-brief-output]');
const briefCount = document.querySelector('[data-brief-count]');
const briefProgress = document.querySelector('[data-brief-progress]');
const briefStatus = document.querySelector('[data-brief-status]');

const briefLabels = {
  context: 'Operating context',
  location: 'Location and environment',
  problem: 'What is failing, and when',
  impact: 'Who or what is affected',
  critical: 'What must keep working',
  current: 'Current connectivity and equipment',
  timing: 'Time constraints or important dates',
  success: 'What a successful outcome looks like'
};

function preparedBrief() {
  const lines = ['AlpskiMedved.solutions — project brief', ''];
  briefFields.forEach((field) => {
    const value = field.value.trim();
    lines.push(`${briefLabels[field.name]}:`);
    lines.push(value || '[not provided yet]');
    lines.push('');
  });
  return lines.join('\n').trim();
}

function updateBrief() {
  const completed = briefFields.filter((field) => field.value.trim()).length;
  const percentage = briefFields.length ? (completed / briefFields.length) * 100 : 0;
  if (briefOutput) briefOutput.textContent = preparedBrief();
  if (briefCount) briefCount.textContent = `${completed} / ${briefFields.length}`;
  if (briefProgress) briefProgress.style.width = `${percentage}%`;
  if (briefStatus) briefStatus.textContent = '';
}

async function copyPreparedBrief() {
  const text = preparedBrief();
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw error;
  }
  if (briefStatus) briefStatus.textContent = 'Prepared brief copied. It is ready to paste into a message or working document.';
}

function downloadPreparedBrief() {
  const file = new Blob([`${preparedBrief()}\n`], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = 'alpskimedved-project-brief.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  if (briefStatus) briefStatus.textContent = 'Project brief downloaded as a plain-text file.';
}

function clearBrief() {
  if (!briefFields.some((field) => field.value.trim())) return;
  if (!window.confirm('Clear every answer in this project brief?')) return;
  briefForm.reset();
  updateBrief();
  briefFields[0]?.focus();
  if (briefStatus) briefStatus.textContent = 'All answers cleared.';
}

briefForm?.addEventListener('input', updateBrief);
briefForm?.addEventListener('change', updateBrief);
briefForm?.addEventListener('submit', (event) => event.preventDefault());
document.querySelector('[data-brief-copy]')?.addEventListener('click', copyPreparedBrief);
document.querySelector('[data-brief-download]')?.addEventListener('click', downloadPreparedBrief);
document.querySelector('[data-brief-clear]')?.addEventListener('click', clearBrief);
updateBrief();
