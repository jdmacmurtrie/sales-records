import React from "react";
import ReactTable from "react-table";
import { currencyFormatter } from "../constants";
import { calculateTransactionTotal } from "../utils";

export class BreakReport extends React.Component {
  getBreakData() {
    // loop through each investor to find errors for thier numbers
    return this.props.investors.map(investor => {
      const errors = this.findErrors(investor);
      return {
        investor,
        ...errors
      };
    });
  }

  findErrors(investor) {
    const investorData = this.props.allData.filter(dataLine => dataLine.INVESTOR === investor);
    return {
      shareErrors: this.findShareErrors(investorData),
      cashErrors: this.findCashErrors(investorData)
    };
  }

  findShareErrors(data) {
    let totalShares = 0;
    data.forEach(dataLine => {
      if (dataLine.TXN_TYPE === "BUY") {
        totalShares += dataLine.TXN_SHARES;
      } else {
        totalShares -= dataLine.TXN_SHARES;
      }
    });
    // if the number is positive, no error.  Otherwise return the erroneous amount.
    return Math.sign(totalShares) === 1 ? "No Error" : totalShares;
  }

  findCashErrors(data) {
    const netAmount = calculateTransactionTotal(data);
    return Math.sign(netAmount) === 1 ? "No Error" : currencyFormatter.format(netAmount);
  }

  getColumns() {
    return [
      {
        Header: "Investor",
        accessor: "investor"
      },
      {
        Header: "Cash Errors",
        accessor: "cashErrors"
      },
      {
        Header: "Share Errors",
        accessor: "shareErrors"
      }
    ];
  }

  render() {
    return (
      <ReactTable
        data={this.getBreakData()}
        columns={this.getColumns()}
        defaultPageSize={5}
        showPagination={false}
      />
    );
  }
}
