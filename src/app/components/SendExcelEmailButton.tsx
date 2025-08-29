import React, { useState } from 'react';

export default function SendExcelEmailButton({ tableData }: { tableData: any[] }) {
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    setSending(true);
    setMessage('');
    const res = await fetch('/api/send-excel-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, tableData }),
    });
    const result = await res.json();
    if (result.success) {
      setMessage('Email sent successfully!');
    } else {
      setMessage('Failed to send email: ' + (result.error || 'Unknown error'));
    }
    setSending(false);
  };

  return (
     <div className="flex items-center gap-2 h-10">
      <input
        type="email"
        placeholder="Recipient Gmail address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
       className="border rounded px-3 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        required
      />
      <button
        onClick={handleSend}
        disabled={sending || !recipient}
       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 h-10 rounded transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {sending ? 'Sending...' : 'Send to Email'}
      </button>
      {message && <div style={{ marginTop: 8, color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
}
