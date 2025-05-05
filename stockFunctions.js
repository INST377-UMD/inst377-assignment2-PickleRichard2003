document.getElementById("stock-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const ticker = document.getElementById("ticker").value.toUpperCase();
    const days = parseInt(document.getElementById("range").value);
    const apiKey = 'gMcyKjIc_lj4OWSgsnulwJpgSs7D9mwa'; 
  
    const today = new Date();
    today.setDate(today.getDate() - 1); 
    const past = new Date();
    past.setDate(today.getDate() - days);
  
    const formatDate = date => date.toISOString().split('T')[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(past)}/${formatDate(today)}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;
  
    try {
      const res = await fetch(url);
      console.log("Raw response:", res);
  
      const data = await res.json();
      console.log("Full API response:", data);
  
      if (!data.results || data.results.length === 0) {
        alert(data.error || "No data found for the specified ticker and date range.");
        return;
      }
  
      const labels = data.results.map(d => new Date(d.t).toLocaleDateString());
      const prices = data.results.map(d => d.c);
  
      const ctx = document.getElementById("stockChart").getContext("2d");
      if (window.stockChart && typeof window.stockChart.destroy === 'function') {
        window.stockChart.destroy();
      }
  
      window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${ticker} Closing Prices`,
            data: prices,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: true
        }
      });
    } catch (err) {
      console.error("Fetch or parse error:", err);
      alert("Error fetching stock data. Check the console for more details.");
    }
  });
  
  async function loadRedditStocks() {
    try {
      const res = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
      const data = await res.json();
      const table = document.querySelector("#reddit-stocks tbody");
      table.innerHTML = "";
  
      data.slice(0, 5).forEach(stock => {
        const row = document.createElement("tr");
  
        const link = document.createElement("a");
        link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        link.textContent = stock.ticker;
        link.target = "_blank";
  
        row.innerHTML = `
          <td>${link.outerHTML}</td>
          <td>${stock.no_of_comments}</td>
          <td>${stock.sentiment === 'Bullish' ? '🐂' : '🐻'}</td>
        `;
        table.appendChild(row);
      });
    } catch (err) {
      console.error("Failed to load Reddit stocks", err);
    }
  }
  
  loadRedditStocks();
  
  if (annyang) {
    annyang.addCommands({
      'lookup *stock': stock => {
        document.getElementById("ticker").value = stock.toUpperCase();
        document.getElementById("range").value = "30";
        document.getElementById("stock-form").dispatchEvent(new Event("submit"));
      }
    });
  }
  