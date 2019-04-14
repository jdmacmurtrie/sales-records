import React from "react";
import { SalesSummaries } from "./components/SalesSummaries";
import { ShareSummaries } from "./components/ShareSummaries";
import { BreakReport } from "./components/BreakReport";
import { InvestorProfit } from "./components/InvestorProfit";

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
        const parsedData = data.map(dataLine => {
          return {
            ...dataLine,
            TXN_DATE: new Date(dataLine["TXN_DATE"]),
            TXN_PRICE: dataLine.TXN_PRICE.replace("$", ""),
            TXN_SHARES: +dataLine.TXN_SHARES,
            transactionTotal: +dataLine.TXN_SHARES * +dataLine.TXN_PRICE.replace("$", "")
          };
        });
        console.log("Data:", parsedData);
        const salesReps = [...new Set(data.map(x => x.SALES_REP))];
        const investors = [...new Set(data.map(x => x.INVESTOR))];
        const funds = [...new Set(data.map(x => x.FUND))];
        this.setState({ investors, salesReps, funds, allData: parsedData });
      })
      .catch(err => {
        console.log("errors", err);
      });
  }

  render() {
    return (
      <div className="container">
        <SalesSummaries {...this.state} />
        <ShareSummaries {...this.state} />
        <BreakReport {...this.state} />
        <InvestorProfit {...this.state} />
      </div>
    );
  }
}

export default App;
