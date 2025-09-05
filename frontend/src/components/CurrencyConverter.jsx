import React, { useState } from "react";
import countryCode from "./currencyCountryData";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExchange = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setExchangeRate("");
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setExchangeRate("");
    try {
      const url = `https://v6.exchangerate-api.com/v6/270033efe4cc19c5af3cc701/latest/${fromCurrency}`;
      const res = await fetch(url);
      const result = await res.json();
      const rate = result.conversion_rates[toCurrency];
      const total = (amount * rate).toFixed(2);
      setExchangeRate(`${amount} ${fromCurrency} = ${total} ${toCurrency}`);
    } catch {
      setExchangeRate("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[40vh] bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex flex-col items-center justify-center rounded-2xl shadow-lg p-8 text-gray-900 border-2 border-purple-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 flex flex-col gap-4">
  
        <form onSubmit={handleConvert} className="flex flex-col gap-4">
          <div>
            <label className="block text-base font-medium mb-1">Enter the amount</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border-2 border-purple-200 rounded px-3 py-2 text-lg focus:border-purple-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex flex-col items-center flex-shrink-0">
              <label className="text-sm font-semibold mb-1">From</label>
              <div className="flex items-center gap-2">
                <img src={`https://flagsapi.com/${countryCode[fromCurrency]}/flat/64.png`} alt="flag" className="w-8 h-8 rounded" />
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="border rounded px-2 py-1 text-base"
                >
                  {Object.keys(countryCode).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" className="text-purple-600 hover:text-purple-900 text-2xl px-2" title="Exchange" onClick={handleExchange}>
              <i className="fas fa-exchange-alt"></i>
            </button>
            <div className="flex flex-col items-center flex-shrink-0">
              <label className="text-sm font-semibold mb-1">To</label>
              <div className="flex items-center gap-2">
                <img src={`https://flagsapi.com/${countryCode[toCurrency]}/flat/64.png`} alt="flag" className="w-8 h-8 rounded" />
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  className="border rounded px-2 py-1 text-base"
                >
                  {Object.keys(countryCode).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 text-white font-bold text-lg shadow hover:from-purple-600 hover:to-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Getting Exchange Rate..." : "Get Exchange Rate"}
          </button>
        </form>
        <div className="exchange-rate text-lg font-bold text-center mt-2">
          {exchangeRate}
        </div>
      </div>
    </div>
  );
}
