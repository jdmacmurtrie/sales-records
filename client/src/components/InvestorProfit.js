import React from "react";
import ReactTable from "react-table";
import { currencyFormatter } from "../constants";
import { calculateTransactionTotal } from "../utils";

export class InvestorProfit extends React.Component {
  getProfitData() {
    // find the net loss/profit for each investor first, then for each fund
    return this.props.investors.map(investor => {
      const net = this.findNet(investor);

      const tableData = { investor };
      net.forEach(n =>
        Object.assign(tableData, {
          [n.fund]: currencyFormatter.format(n.total)
        })
      );
      const fundTotal = this.getFundTotal(net);
      Object.assign(tableData, { total: currencyFormatter.format(fundTotal) });
      return tableData;
    });
  }

  findNet(investor) {
    return this.props.funds.map(fund => {
      // find fund and investor specific data
      const investorFundData = this.props.allData.filter(
        dataLine => dataLine.INVESTOR === investor && dataLine.FUND === fund
      );
      const total = calculateTransactionTotal(investorFundData);
      return { fund, total };
    });
  }

  getFundTotal(net) {
    let total = 0;
    net.forEach(n => {
      total += n.total;
    });
    return total;
  }

  getColumns() {
    const columns = this.props.funds.map(fund => {
      return {
        Header: fund,
        accessor: fund
      };
    });
    columns.unshift({
      Header: "Investor",
      accessor: "investor"
    });
    columns.push({
      Header: "Total",
      accessor: "total"
    });
    return columns;
  }

  render() {
    return (
      <ReactTable
        data={this.getProfitData()}
        columns={this.getColumns()}
        defaultPageSize={5}
        showPagination={false}
      />
    );
  }
}
