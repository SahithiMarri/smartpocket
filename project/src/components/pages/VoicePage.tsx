import React, { useState } from 'react';
import { Mic, MicOff, Plus, Check, X } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { parseVoiceInput, getCategoryEmoji } from '../../utils/voiceParser';
import { storage } from '../../utils/storage';
import { Transaction, VoiceParseResult } from '../../types';

export function VoicePage() {
  const [transcript, setTranscript] = useState('');
  const [parseResult, setParseResult] = useState<VoiceParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    amount: '',
    category: 'other',
    description: '',
    type: 'expense' as 'income' | 'expense'
  });

  const handleVoiceResult = (result: string) => {
    setTranscript(result);
    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const parsed = parseVoiceInput(result);
      setParseResult(parsed);
      setIsProcessing(false);
    }, 1000);
  };

  const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition({
    onResult: handleVoiceResult,
    onError: (error) => console.error('Voice error:', error)
  });

  const confirmTransaction = () => {
    if (!parseResult) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: parseResult.amount,
      category: parseResult.category,
      description: parseResult.description,
      type: parseResult.type,
      date: new Date(),
      emoji: getCategoryEmoji(parseResult.category)
    };

    storage.saveTransaction(transaction);
    setTranscript('');
    setParseResult(null);
    
    // Show success feedback
    setTimeout(() => {
      alert('Transaction added successfully! 🎉');
    }, 100);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(manualTransaction.amount),
      category: manualTransaction.category,
      description: manualTransaction.description,
      type: manualTransaction.type,
      date: new Date(),
      emoji: getCategoryEmoji(manualTransaction.category)
    };

    storage.saveTransaction(transaction);
    setManualTransaction({
      amount: '',
      category: 'other',
      description: '',
      type: 'expense'
    });
    setShowManualForm(false);
    
    alert('Transaction added successfully! 🎉');
  };

  const categories = ['food', 'entertainment', 'transport', 'shopping', 'education', 'health', 'other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 pt-8">
      <div className="px-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Voice Transaction</h1>
          <p className="text-slate-600 text-lg">Speak naturally about your expenses and income</p>
        </div>

        {/* Voice Input Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!isSupported || isProcessing}
                className={`w-28 h-28 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg ${
                  isListening
                    ? 'bg-red-500 shadow-red-200'
                    : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-200'
                } ${(!isSupported || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
              >
                {isListening ? <MicOff size={36} /> : <Mic size={36} />}
              </button>
              
              {isListening && (
                <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping"></div>
              )}
            </div>
            
            <div className="mt-6">
              <p className="text-lg font-medium text-slate-700 mb-2">
                {!isSupported 
                  ? 'Voice recognition not supported'
                  : isListening 
                    ? 'Listening...'
                    : isProcessing
                      ? 'Processing your input...'
                      : 'Tap to start recording'
                }
              </p>
              <p className="text-sm text-slate-500">
                {isListening && 'Speak clearly about your transaction'}
              </p>
            </div>
          </div>

          {/* Example phrases */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Example phrases
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-green-600">💰</span>
                <span>"I received ₹500 as allowance"</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-red-600">💸</span>
                <span>"I spent ₹100 on lunch"</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-blue-600">🚌</span>
                <span>"Paid ₹50 for bus fare"</span>
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Transcript
              </h3>
              <p className="text-slate-700 italic bg-white p-4 rounded-lg border">"{transcript}"</p>
            </div>
          )}

          {/* Parse Result */}
          {parseResult && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Parsed Transaction
              </h3>
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Type:</span>
                    <span className={`font-semibold ${
                      parseResult.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseResult.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-semibold text-slate-800">₹{parseResult.amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Category:</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {getCategoryEmoji(parseResult.category)} {parseResult.category}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Confidence:</span>
                    <span className="font-semibold text-slate-800">{(parseResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmTransaction}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={18} /> Confirm Transaction
                </button>
                <button
                  onClick={() => {
                    setTranscript('');
                    setParseResult(null);
                  }}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Entry Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="bg-white hover:bg-slate-50 text-slate-700 py-4 px-8 rounded-2xl font-medium border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg"
          >
            <Plus size={20} />
            Manual Entry
          </button>
        </div>

        {/* Manual Entry Form */}
        {showManualForm && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Manual Transaction Entry
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Transaction Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setManualTransaction(prev => ({ ...prev, type: 'expense' }))}
                    className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 border-2 ${
                      manualTransaction.type === 'expense'
                        ? 'bg-red-500 text-white border-red-500 shadow-lg'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 border-2 ${
                      manualTransaction.type === 'income'
                        ? 'bg-green-500 text-white border-green-500 shadow-lg'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    💰 Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Amount (₹)</label>
                <input
                  type="number"
                  value={manualTransaction.amount}
                  onChange={(e) => setManualTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                <select
                  value={manualTransaction.category}
                  onChange={(e) => setManualTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Description</label>
                <input
                  type="text"
                  value={manualTransaction.description}
                  onChange={(e) => setManualTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  placeholder="What was this transaction for?"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add Transaction
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useRef } from 'react';
// import { Mic, MicOff, Plus, Check, X } from 'lucide-react';
// import { getCategoryEmoji } from '../../utils/voiceParser';
// import { storage } from '../../utils/storage';
// import { Transaction, VoiceParseResult } from '../../types';

// declare global {
//   interface Window {
//     Omnidimension: any;
//   }
// }

// export function VoicePage() {
//   const [transcript, setTranscript] = useState('');
//   const [assistantResponse, setAssistantResponse] = useState('');
//   const [parseResult, setParseResult] = useState<VoiceParseResult | null>(null);
//   const [isTalking, setIsTalking] = useState(false);
//   const [showManualForm, setShowManualForm] = useState(false);
//   const omnidimCall = useRef<any>(null);

//   const [manualTransaction, setManualTransaction] = useState({
//     amount: '',
//     category: 'other',
//     description: '',
//     type: 'expense' as 'income' | 'expense'
//   });

//   const startAssistant = async () => {
//     setTranscript('');
//     setAssistantResponse('');
//     setParseResult(null);

//     try {
//       const call = await window.Omnidimension.init({
//         agent_id: 2888,
//         input_type: 'microphone',
//         on_transcript: (text: string) => setTranscript(text),
//         on_message: (msg: string) => {
//           setAssistantResponse(msg);

//           // Attempt to parse structured variables from assistant message
//           try {
//             const parts = msg.match(/Spent ₹?(\d+)/i);
//             if (parts) {
//               setParseResult({
//                 amount: parseFloat(parts[1]),
//                 category: 'other',
//                 description: transcript,
//                 type: 'expense',
//                 confidence: 1
//               });
//             }
//           } catch {}
//         },
//         on_end: () => {
//           setIsTalking(false);
//           omnidimCall.current = null;
//         },
//         on_error: () => {
//           setIsTalking(false);
//           omnidimCall.current = null;
//         }
//       });

//       omnidimCall.current = call;
//       setIsTalking(true);
//       await call.start();
//     } catch (err) {
//       console.error('Omnidimension start error:', err);
//     }
//   };

//   const stopAssistant = () => {
//     if (omnidimCall.current) {
//       omnidimCall.current.stop();
//       omnidimCall.current = null;
//     }
//     setIsTalking(false);
//   };

//   const confirmTransaction = () => {
//     if (!parseResult) return;

//     const t: Transaction = {
//       id: Date.now().toString(),
//       amount: parseResult.amount,
//       category: parseResult.category,
//       description: parseResult.description,
//       type: parseResult.type,
//       date: new Date(),
//       emoji: getCategoryEmoji(parseResult.category)
//     };

//     storage.saveTransaction(t);
//     setTranscript('');
//     setAssistantResponse('');
//     setParseResult(null);
//     setIsTalking(false);

//     setTimeout(() => alert('Transaction added! 🎉'), 100);
//   };

//   const handleManualSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const t: Transaction = {
//       id: Date.now().toString(),
//       amount: parseFloat(manualTransaction.amount),
//       category: manualTransaction.category,
//       description: manualTransaction.description,
//       type: manualTransaction.type,
//       date: new Date(),
//       emoji: getCategoryEmoji(manualTransaction.category)
//     };

//     storage.saveTransaction(t);
//     setManualTransaction({ amount: '', category: 'other', description: '', type: 'expense' });
//     setShowManualForm(false);
//     alert('Transaction added! 🎉');
//   };

//   const categories = ['food', 'entertainment', 'transport', 'shopping', 'education', 'health', 'other'];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 pt-8">
//       <div className="px-6 max-w-lg mx-auto">
//         <h1 className="text-3xl font-bold text-slate-800 mb-3 text-center">Voice Transaction</h1>
//         <button
//           onClick={isTalking ? stopAssistant : startAssistant}
//           className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-lg mx-auto ${
//             isTalking ? 'bg-red-500' : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700'
//           }`}
//         >
//           {isTalking ? <MicOff size={36} /> : <Mic size={36} />}
//         </button>

//         {(transcript || assistantResponse) && (
//           <div className="mt-6 space-y-4">
//             {transcript && (
//               <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
//                 <strong>🗣️ You said:</strong> {transcript}
//               </div>
//             )}
//             {assistantResponse && (
//               <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
//                 <strong>🤖 SmartBuddy:</strong> {assistantResponse}
//               </div>
//             )}
//             {parseResult && (
//               <button
//                 onClick={confirmTransaction}
//                 className="w-full bg-green-600 text-white py-3 rounded-xl"
//               >
//                 <Check size={18} /> Confirm Transaction
//               </button>
//             )}
//           </div>
//         )}

//         <div className="mt-10 text-center">
//           <button
//             onClick={() => setShowManualForm(!showManualForm)}
//             className="bg-white text-slate-700 py-3 px-6 rounded-xl border shadow-lg inline-flex items-center gap-2"
//           >
//             <Plus size={20} /> Manual Entry
//           </button>
//         </div>

//         {showManualForm && (
//           <form onSubmit={handleManualSubmit} className="bg-white p-6 mt-6 rounded-xl shadow-lg space-y-4">
//             <div>
//               <label>Amount (₹)</label>
//               <input
//                 type="number"
//                 value={manualTransaction.amount}
//                 onChange={e => setManualTransaction(p => ({ ...p, amount: e.target.value }))}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div>
//               <label>Category</label>
//               <select
//                 value={manualTransaction.category}
//                 onChange={e => setManualTransaction(p => ({ ...p, category: e.target.value }))}
//                 className="w-full border p-2 rounded"
//               >
//                 {categories.map(c => (
//                   <option key={c} value={c}>
//                     {getCategoryEmoji(c)} {c.charAt(0).toUpperCase() + c.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Description</label>
//               <input
//                 type="text"
//                 value={manualTransaction.description}
//                 onChange={e => setManualTransaction(p => ({ ...p, description: e.target.value }))}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl">
//               Add Transaction
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
