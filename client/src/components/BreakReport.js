import React from "react";
import ReactTable from "react-table";
import { currencyFormatter } from "../constants";

export class BreakReport extends React.Component {
  getBreakData() {
    return this.props.investors.map(investor => {
      const errors = this.findErrors(investor);
      return {
        investor,
        shareErrors: errors.shareErrors,
        cashErrors: errors.cashErrors
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
    return Math.sign(totalShares) === 1 ? "No Error" : totalShares;
  }

  findCashErrors(data) {
    let netAmount = 0;
    data.forEach(dataLine => {
      if (dataLine.TXN_TYPE === "BUY") {
        netAmount += dataLine.transactionTotal;
      } else {
        netAmount -= dataLine.transactionTotal;
      }
    });
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
