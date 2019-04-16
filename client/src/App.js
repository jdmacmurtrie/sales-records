import React from "react";
import { SalesSummaries } from "./components/SalesSummaries";
import { ShareSummaries } from "./components/ShareSummaries";
import { BreakReport } from "./components/BreakReport";
import { InvestorProfit } from "./components/InvestorProfit";
import { titleCase } from "./utils";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: [],
      salesReps: [],
      investors: [],
      funds: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/data")
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(data => {
        // Massage data to be more calculation friendly.
        // It will be converted back to readable before getting displayed.
        const parsedData = data.map(dataLine => {
          return {
            ...dataLine,
            TXN_DATE: new Date(dataLine["TXN_DATE"]),
            TXN_PRICE: dataLine.TXN_PRICE.replace("$", ""),
            TXN_SHARES: +dataLine.TXN_SHARES,
            FUND: titleCase(dataLine.FUND),
            transactionTotal: +dataLine.TXN_SHARES * +dataLine.TXN_PRICE.replace("$", "")
          };
        });
        // extract subdata sets from data to be used later
        const salesReps = [...new Set(data.map(x => x.SALES_REP))];
        const investors = [...new Set(data.map(x => x.INVESTOR))];
        const funds = [...new Set(data.map(x => titleCase(x.FUND)))];
        this.setState({ investors, salesReps, funds, allData: parsedData });
      })
      .catch(err => {
        console.log("errors", err);
      });
  }

  render() {
    return (
      <div className="container">
        <h1>Investment Summaries</h1>
        <div className="table-display">
          <h3>Sales Summary</h3>
          <SalesSummaries {...this.state} />
        </div>
        <div className="table-display">
          <h3>Assets Under Management Summary</h3>
          <ShareSummaries {...this.state} />
        </div>
        <div className="table-display">
          <h3>Break Report</h3>
          <BreakReport {...this.state} />
        </div>
        <div className="table-display">
          <h3>Investor Profit</h3>
          <InvestorProfit {...this.state} />
        </div>
      </div>
    );
  }
}

export default App;
