import React from "react";
import ReactTable from "react-table";

export class InvestorProfit extends React.Component {
  getProfitData() {
    return this.props.investors.map(investor => {
      const net = this.findNet(investor);
      const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

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
      let total = 0;
      const investorFundData = this.props.allData.filter(
        dataLine => dataLine.INVESTOR === investor && dataLine.FUND === fund
      );
      investorFundData.forEach(dataLine => {
        if (dataLine.TXN_TYPE === "BUY") {
          total += dataLine.transactionTotal;
        } else {
          total -= dataLine.transactionTotal;
        }
      });
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
