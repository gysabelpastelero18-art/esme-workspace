'use client';

import { useState } from 'react';

interface HtmlDailyReportProps {
  selectedBranch: 'mayon' | 'balete';
  onClose: () => void;
}

const HtmlDailyReport = ({ selectedBranch, onClose }: HtmlDailyReportProps) => {
  const branchName = selectedBranch === 'mayon' ? 'ESMERALDA - MAYON' : 'ESMERALDA - ONE BALETE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sales data saved successfully!');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: '1100px',
        width: '100%',
        maxHeight: '95vh',
        overflow: 'auto',
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .dsr-table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1.2rem;
            }
            .dsr-table th, .dsr-table td {
              border: 1px solid #888;
              padding: 4px 6px;
              text-align: left;
            }
            .dsr-table th {
              background: #eafaf1;
            }
            .dsr-table td input, .dsr-table td textarea {
              width: 100%;
              border: none;
              background: transparent;
              text-align: left;
              font-size: 1em;
            }
            .dsr-table td input[type="number"], 
            .dsr-table td input.number-input,
            .dsr-table td input.amount-input {
              text-align: right;
            }
            .dsr-table td input[type="text"], .dsr-table td input[type="date"] {
              padding: 2px 4px;
            }
            .center { text-align: center; }
            .left { text-align: left; }
            .narrow { width: 80px; }
            .wider { width: 120px; }
            .readonly { background: #f3f3f3; color: #444; }
            .narrow-col {
              width: 80px;
              min-width: 60px;
              max-width: 100px;
            }
            .perc-col {
              border-left: 1px solid #888 !important;
              border-right: 1px solid #888 !important;
              background: #f9f9f9;
              width: 5px;
              min-width: 5px;
              max-width: 20px;
              padding-left: 2px;
              padding-right: 2px;
            }
            .perc-col input[type="text"] {
              width: 100%;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              text-align: right;
              padding: 0 2px;
              font-size: 12px;
              color: red;
            }
            .amount-col {
              border-left: 2px solid #444 !important;
              border-right: 2px solid #444 !important;
              background: #f9f9f9;
            }
            .amount-col input {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }
            .save-btn {
              background: #229954;
              color: #fff;
              border: none;
              border-radius: 5px;
              padding: 10px 28px;
              font-size: 1.1em;
              font-weight: bold;
              cursor: pointer;
              margin-right: 10px;
            }
            .save-btn:hover {
              background: #145a32;
            }
            .close-btn {
              background: #dc3545;
              color: #fff;
              border: none;
              border-radius: 5px;
              padding: 10px 28px;
              font-size: 1.1em;
              font-weight: bold;
              cursor: pointer;
            }
            .close-btn:hover {
              background: #c82333;
            }
          `
        }} />

        <form onSubmit={handleSubmit}>
          <table className="dsr-table">
            <tbody>
              <tr>
                <th colSpan={9} className="center" style={{ fontSize: '1.3em', textAlign: 'center' }}>DAILY SALES REPORT</th>
              </tr>
            <tr>
              <th colSpan={5} className="left" style={{ fontSize: '1.1em' }}>
                <span>{branchName}</span>
              </th>
               <td></td>
              <th colSpan={3} className="left" style={{ fontSize: '1.3em' }}>
                DATE
                <span style={{ marginLeft: '20px' }}>
                  <input 
                    type="date" 
                    name="date" 
                    style={{ width: '140px' }} 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </span>
              </th>
            </tr>
            <tr>
              <th colSpan={5} className="center">SOLD QUANTITY</th>
              <td></td>
              <th colSpan={3} className="center">CASH POSITION</th>
            </tr>
            <tr>
              <th className="center">SALES</th>
              <th className="center">StoreHub</th>
              <th className="center">EsmeHub</th>
              <th className="center">Amount</th>
              <th className="center">perc</th>
              <td></td>
              <th colSpan={2} className="left">Total Amount</th>
              <th className="center">Amount2</th>
            </tr>
            
            {/* TOTAL AMOUNT Row */}
            <tr>
              <td className="left">TOTAL AMOUNT</td>
              <td><input type="text" name="storehub_total" className="number-input" /></td>
              <td><input type="text" name="esmehub_total" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="amount_total" name="amount_total" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">Less: Gcash - Ann</td>
              <td className="narrow-col"><input type="text" name="less_gcash" id="less_gcash" className="number-input" /></td>
              <td><input type="text" name="gcash_amount" className="amount-input" /></td>
            </tr>
            
            {/* Discounts Row */}
            <tr>
              <td className="left">Discounts</td>
              <td><input type="text" id="discounts_storehub" name="discounts_storehub" className="number-input" /></td>
              <td><input type="text" id="discounts_esmehub" name="discounts_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="discounts_amount" name="discounts_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">Less: Debit / Credit</td>
              <td>
                <input type="text" name="less_debit" id="less_debit" className="number-input" />
                <input type="text" name="less_credit" id="less_credit" style={{ marginTop: '2px' }} className="number-input" />
              </td>
              <td>
                <input type="text" name="debit_amount" id="debit_amount" readOnly className="readonly amount-input" />
              </td>
            </tr>
            
            {/* Kitchen Row */}
            <tr>
              <td className="left">Kitchen</td>
              <td><input type="text" id="kitchen_storehub" name="kitchen_storehub" className="number-input" /></td>
              <td><input type="text" id="kitchen_esmehub" name="kitchen_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="kitchen_amount" name="kitchen_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"><input type="text" id="kitchen_perc" name="kitchen_perc" /></td>
              <td></td>
              <td className="left">Less: BDO</td>
              <td className="narrow-col"><input type="text" name="less_bdo" id="less_bdo" className="number-input" /></td>
              <td><input type="text" name="bdo_amount" className="amount-input" /></td>
            </tr>
            
            {/* Beverages Row */}
            <tr>
              <td className="left">Beverages</td>
              <td><input type="text" id="beverages_storehub" name="beverages_storehub" className="number-input" /></td>
              <td><input type="text" id="beverages_esmehub" name="beverages_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="beverages_amount" name="beverages_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"><input type="text" id="beverages_perc" name="beverages_perc" /></td>
              <td></td>
              <td className="left">Less: BPI</td>
              <td><input type="text" name="less_bpi" id="less_bpi" className="number-input" /></td>
              <td><input type="text" name="bpi_amount" className="amount-input" /></td>
            </tr>
            
            {/* Commissary Row */}
            <tr>
              <td className="left">Commissary</td>
              <td><input type="text" id="commissary_storehub" name="commissary_storehub" className="number-input" /></td>
              <td><input type="text" id="commissary_esmehub" name="commissary_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="commissary_amount" name="commissary_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"><input type="text" id="commissary_perc" name="commissary_perc" /></td>
              <td></td>
              <td className="left">Less: C/O BOSS</td>
              <td><input type="text" name="less_boss" className="number-input" /></td>
              <td><input type="text" name="boss_amount" className="amount-input" /></td>
            </tr>
            
            {/* Bakery Row */}
            <tr>
              <td className="left">Bakery</td>
              <td><input type="text" id="bakery_storehub" name="bakery_storehub" className="number-input" /></td>
              <td><input type="text" id="bakery_esmehub" name="bakery_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="bakery_amount" name="bakery_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"><input type="text" id="bakery_perc" name="bakery_perc" /></td>
              <td></td>
              <td className="left">Less: DOWN PAY/ADVANCE</td>
              <td><input type="text" name="less_downpay" className="number-input" /></td>
              <td><input type="text" name="dp_amount" className="amount-input" /></td>
            </tr>
            
            {/* Dessert Row */}
            <tr>
              <td className="left">DESSERT</td>
              <td><input type="text" id="dessert_storehub" name="dessert_storehub" className="number-input" /></td>
              <td><input type="text" id="dessert_esmehub" name="dessert_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="dessert_amount" name="dessert_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"><input type="text" id="dessert_perc" name="dessert_perc" /></td>
              <td></td>
              <td className="left">Less: SERVEX MANAGERS MEALS</td>
              <td><input type="text" name="less_servex" className="number-input" /></td>
              <td><input type="text" name="servex_amount" className="amount-input" /></td>
            </tr>
            
            {/* Corkage/Others Row */}
            <tr>
              <td className="left">CORKAGE/OTHERS</td>
              <td><input type="text" id="corkage_storehub" name="corkage_storehub" className="number-input" /></td>
              <td><input type="text" id="corkage_esmehub" name="corkage_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="corkage_amount" name="corkage_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"><input type="text" id="corkage_perc" name="corkage_perc" /></td>
              <td></td>
              <td className="left">Less: GC</td>
              <td><input type="text" name="less_gc" className="number-input" /></td>
              <td><input type="text" name="gc_amount" className="amount-input" /></td>
            </tr>
            
            {/* Service Charge Row */}
            <tr>
              <td className="left">Service Charge</td>
              <td><input type="text" id="service_charge_storehub" name="service_charge_storehub" className="number-input" /></td>
              <td><input type="text" id="service_charge_esmehub" name="service_charge_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="service_charge_amount" name="service_charge_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">Less: short.</td>
              <td><input type="text" name="less_short" className="number-input" /></td>
              <td><input type="text" name="short_amount" className="amount-input" /></td>
            </tr>
            
            {/* Delivery Fee Row */}
            <tr>
              <td className="left">Delivery Fee</td>
              <td><input type="text" id="delivery_fee_storehub" name="delivery_fee_storehub" className="number-input" /></td>
              <td><input type="text" id="delivery_fee_esmehub" name="delivery_fee_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="delivery_fee_amount" name="delivery_fee_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left"></td>
              <td><input type="text" name="add_blpay" className="number-input" /></td>
              <td><input type="text" name="bl_amount" className="amount-input" /></td>
            </tr>
            
            {/* VAT-Exempt Row */}
            <tr>
              <td className="left">VAT-Exempt sc/pwd</td>
              <td><input type="text" id="vat_exempt_storehub" name="vat_exempt_storehub" className="number-input" /></td>
              <td><input type="text" id="vat_exempt_esmehub" name="vat_exempt_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="vat_exempt_amount" name="vat_exempt_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">Add: Advance Pay</td>
              <td><input type="text" name="add_advancepay" className="number-input" /></td>
              <td><input type="text" name="advance_amount" className="amount-input" /></td>
            </tr>
            
            {/* Total Row */}
            <tr>
              <td className="left">total</td>
              <td><input type="text" id="tot_storehub" name="tot_storehub" className="number-input" /></td>
              <td><input type="text" id="tot_esmehub" name="tot_esmehub" className="number-input" /></td>
              <td className="amount-col">
                <input type="text" id="tot_amount" name="tot_amount" readOnly className="readonly amount-input" />
              </td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">Add: Excess Cash</td>
              <td><input type="text" name="add_excesscash" className="number-input" /></td>
              <td><input type="text" name="excess_amount" className="amount-input" /></td>
            </tr>
            
            {/* Number of Transactions Row */}
            <tr>
              <td className="left">NO. Of Trans</td>
              <td><input type="text" name="of_trans_storehub" className="number-input" /></td>
              <td><input type="text" name="of_trans_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="of_trans_amount" name="of_trans_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">Add:</td>
              <td><input type="text" name="add_cash" className="number-input" /></td>
              <td><input type="text" name="add_amount" className="amount-input" /></td>
            </tr>
            
            {/* Number of Customers Row */}
            <tr>
              <td className="left">NO. Of Customers</td>
              <td><input type="text" name="of_customers_storehub" className="number-input" /></td>
              <td><input type="text" name="of_customers_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="of_customers_amount" name="of_customers_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left"></td>
              <td><input type="text" name="bl_totcash" className="number-input" /></td>
              <td><input type="text" name="bl_totamount" className="amount-input" /></td>
            </tr>


             {/* VAT Table */}
            <tr>
              <td className="left">Vatable Sales</td>
              <td><input type="text" name="vatable_sales_storehub" className="number-input" /></td>
              <td><input type="text" name="vatable_sales_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="vatable_sales_amount" name="vatable_sales_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left"></td>
              <td><input type="text" name="bl1_totcash" className="number-input" /></td>
              <td><input type="text" name="bl1_totamount" className="amount-input" /></td>
            </tr>
            <tr>
              <td className="left">Vat Amount</td>
              <td><input type="text" name="vat_amount_storehub" className="number-input" /></td>
              <td><input type="text" name="vat_amount_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="vat_amount" name="vat_amount" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left"></td>
              <td><input type="text" name="bl2_totcash" className="number-input" /></td>
              <td><input type="text" name="bl2_totamount" className="amount-input" /></td>
            </tr>
            <tr>
              <td className="left">Vat Exempt</td>
              <td><input type="text" name="vat_exempt_storehub" className="number-input" /></td>
              <td><input type="text" name="vat_exempt_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="vat_exempt" name="vat_exempt" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left"></td>
              <td><input type="text" name="bl3_totcash" className="number-input" /></td>
              <td><input type="text" name="bl3_totamount" className="amount-input" /></td>
              
            </tr>
             {/* Total Row */}
            <tr>
              <td className="left">Total</td>
              <td><input type="text" name="vat_exempt_storehub" className="number-input" /></td>
              <td><input type="text" name="vat_exempt_esmehub" className="number-input" /></td>
              <td className="amount-col"><input type="text" id="vat_exempt" name="vat_exempt" readOnly className="readonly amount-input" /></td>
              <td className="perc-col"></td>
              <td></td>
              <td className="left">TOTAL CASH DEPOSIT</td>
              <td><input type="text" name="dep_totcash" className="number-input" /></td>
              <td><input type="text" name="dep_totamount" className="amount-input" /></td>
              
            </tr>
            </tbody>
          </table>

          

          {/* Cash Count Table */}
          <table className="dsr-table">
            <tbody>
              <tr>
                <th colSpan={1} className="left w-32">CASH COUNT</th>
                <th className="w-20" style={{ width: '80px' }}></th>
                <th className="w-20" style={{ width: '80px' }}></th>
                <th className="w-20"></th>
                <th className="w-20"></th>
                <th className="w-20"></th>
                <th colSpan={3} className="left w-32">EVENTS</th>
              </tr>
              <tr>
                <td className="w-32">AM Cash Count</td>
                <td className="w-20" style={{ width: '80px' }}></td>
                <td className="w-20"></td>
                <td className="w-12"></td>
                <td className="w-12"></td>
                 <td className="w-12"></td>
                <th className="w-32">Name</th>
                <th className="w-20">Room/Pax</th>
                <th className="w-20">Amount</th>
                
              </tr>
              <tr>
                <td>Counted By/Time</td>
                <td></td>
                <td><input type="text" name="am_cash" className="amount-input" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Checked By/Time</td>
                <td></td>
                <td><input type="text" name="am_cash" className="amount-input" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Spot Cash Count</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Counted By/Time</td>
                <td></td>
                <td><input type="text" name="am_cash" className="amount-input" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                
              </tr>
              <tr>
                <td>Checked By/Time</td>
                <td></td>
                <td><input type="text" name="am_cash" className="amount-input" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               
              </tr>
              <tr>
                <td>PM Cash Count</td>
                <td><input type="text" name="pm_cash" className="amount-input" /></td>
                <td><input type="text" name="pm_counted_by" /></td>
                <td><input type="text" name="pm_checked_by" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                
              </tr>
              <tr>
                <td colSpan={3} className="left">Please attach Deposit Slip Here</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          

          {/* Expenses Table */}
          <table className="dsr-table">
            <tbody>
              <tr>
                <th colSpan={3} className="left">Breakdown of Expenses</th>
              </tr>
              <tr>
                <th>Dept.</th>
                <th>Particular</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td><input type="text" name="expense_dept" /></td>
                <td><input type="text" name="expense_particular" /></td>
                <td><input type="text" name="expense_amount" className="amount-input" /></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: 'right' }}>TOTAL</td>
                <td><input type="text" name="expense_total" className="amount-input" /></td>
              </tr>
            </tbody>
          </table>

          {/* Advance Payments Table */}
          <table className="dsr-table">
            <tbody>
              <tr>
                <th colSpan={4} className="left">Notes of Advance Payments</th>
              </tr>
              <tr>
                <th>Event Date</th>
                <th>Name</th>
                <th>MOP</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td><input type="date" name="advance_event_date" /></td>
                <td><input type="text" name="advance_name" /></td>
                <td><input type="text" name="advance_mop" /></td>
                <td><input type="text" name="advance_amount" className="amount-input" /></td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right' }}>TOTAL</td>
                <td><input type="text" name="advance_total" className="amount-input" /></td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <div>
              <label>Prepared By: <input type="text" name="prepared_by" /></label>
              <label style={{ marginLeft: '20px' }}>Checked By: <input type="text" name="checked_by" /></label>
            </div>
            <div>
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="close-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        </form>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Helper to parse text as float
            function parseNum(val) {
              return parseFloat((val || '').replace(/,/g, '')) || 0;
            }

            // Auto formulas for Amount columns
            function autoSum(row) {
              const storehub = document.getElementById(row + '_storehub');
              const esmehub = document.getElementById(row + '_esmehub');
              const amount = document.getElementById(row + '_amount');
              function calc() {
                if (storehub && esmehub && amount) {
                  amount.value = (parseNum(storehub.value) + parseNum(esmehub.value)).toFixed(2);
                  recalcTotalRow();
                  recalcPerc(row);
                }
              }
              if (storehub && esmehub && amount) {
                storehub.addEventListener('input', calc);
                esmehub.addEventListener('input', calc);
              }
            }

            // List of all rows to auto-calculate
            ['discounts','kitchen','beverages','commissary','bakery','dessert','corkage','service_charge','delivery_fee','vat_exempt'].forEach(autoSum);

            function recalcTotalRow() {
              // Sum from kitchen to corkage for StoreHub, EsmeHub, Amount
              const rows = ['kitchen','beverages','commissary','bakery','dessert','corkage'];
              let storehubSum = 0, esmehubSum = 0, amountSum = 0;
              rows.forEach(row => {
                const storehubEl = document.getElementById(row + '_storehub');
                const esmehubEl = document.getElementById(row + '_esmehub');
                const amountEl = document.getElementById(row + '_amount');
                if (storehubEl) storehubSum += parseNum(storehubEl.value);
                if (esmehubEl) esmehubSum += parseNum(esmehubEl.value);
                if (amountEl) amountSum += parseNum(amountEl.value);
              });
              const totStorehub = document.getElementById('tot_storehub');
              const totEsmehub = document.getElementById('tot_esmehub');
              const totAmount = document.getElementById('tot_amount');
              if (totStorehub) totStorehub.value = storehubSum.toFixed(2);
              if (totEsmehub) totEsmehub.value = esmehubSum.toFixed(2);
              if (totAmount) totAmount.value = amountSum.toFixed(2);
              recalcAmountTotal();
            }

            function recalcPerc(row) {
              const amount = document.getElementById(row + '_amount');
              const totAmount = document.getElementById('tot_amount');
              const percInput = document.getElementById(row + '_perc');
              let perc = '';
              if (amount && totAmount && percInput) {
                const amountVal = parseNum(amount.value);
                const totAmountVal = parseNum(totAmount.value);
                if (totAmountVal > 0) {
                  perc = Math.round((amountVal / totAmountVal) * 100) + '%';
                }
                percInput.value = perc;
              }
            }

            function recalcAmountTotal() {
              const totAmount = document.getElementById('tot_amount');
              const serviceChargeAmount = document.getElementById('service_charge_amount');
              const deliveryFeeAmount = document.getElementById('delivery_fee_amount');
              const discountsAmount = document.getElementById('discounts_amount');
              const amountTotal = document.getElementById('amount_total');
              
              if (totAmount && serviceChargeAmount && deliveryFeeAmount && discountsAmount && amountTotal) {
                const total = parseNum(totAmount.value);
                const serviceCharge = parseNum(serviceChargeAmount.value);
                const deliveryFee = parseNum(deliveryFeeAmount.value);
                const discount = parseNum(discountsAmount.value);
                const result = total + serviceCharge + deliveryFee - discount;
                amountTotal.value = result.toFixed(2);
              }
            }

            // Initial calculation on page load
            setTimeout(() => {
              ['discounts','kitchen','beverages','commissary','bakery','dessert','corkage','service_charge','delivery_fee','vat_exempt'].forEach(function(row) {
                const storehub = document.getElementById(row + '_storehub');
                const esmehub = document.getElementById(row + '_esmehub');
                if (storehub && esmehub) {
                  storehub.dispatchEvent(new Event('input'));
                  esmehub.dispatchEvent(new Event('input'));
                }
              });
              recalcTotalRow();
            }, 100);
          `
        }} />
      </div>
    </div>
  );
};

export default HtmlDailyReport;
