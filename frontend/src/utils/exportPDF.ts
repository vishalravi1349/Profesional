import { Enquiry } from '../types';

export const exportEnquiriesPDF = (enquiries: Enquiry[]): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF.');
    return;
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Build the statistics count
  const stats = enquiries.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusList: Array<'Pending' | 'Reviewing' | 'Contacted' | 'Responded' | 'Approved' | 'Closed'> = [
    'Pending',
    'Reviewing',
    'Contacted',
    'Responded',
    'Approved',
    'Closed',
  ];

  const statsHtml = statusList
    .map((status) => {
      const count = stats[status] || 0;
      return `
        <div class="stat-box status-${status.toLowerCase()}">
          <div class="stat-status">${status}</div>
          <div class="stat-count">${count}</div>
        </div>
      `;
    })
    .join('');

  const rowsHtml = enquiries
    .map(
      (e) => `
    <tr>
      <td><span class="enquiry-id">${e.id}</span></td>
      <td>
        <div class="name-bold">${e.student_name}</div>
        <div class="sub-text">Age: ${e.student_age} | Current Grade: ${e.current_class || 'N/A'}</div>
      </td>
      <td>
        <div class="name-bold">${e.parent_name}</div>
        <div class="sub-text">${e.mobile_number}</div>
        <div class="sub-text">${e.email}</div>
      </td>
      <td><span class="interested-class">${e.interested_class}</span></td>
      <td><span class="pref-badge">${e.preferred_contact_method}</span></td>
      <td><span class="status-badge status-${e.status.toLowerCase()}">${e.status}</span></td>
      <td>${formatDate(e.created_at)}</td>
    </tr>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Noventra School - Admission Enquiries</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
          
          @page {
            size: A4 landscape;
            margin: 12mm 15mm;
          }
          
          body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #d97706; /* Gold/Amber accent */
            padding-bottom: 16px;
            margin-bottom: 20px;
          }

          .school-info h1 {
            font-size: 26px;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -0.5px;
            text-transform: uppercase;
          }

          .school-info p {
            font-size: 12px;
            color: #64748b;
            margin: 4px 0 0 0;
            font-weight: 500;
          }

          .report-info {
            text-align: right;
          }

          .report-title {
            font-size: 13px;
            font-weight: 700;
            color: #d97706;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 4px 0;
          }

          .report-date {
            font-size: 11px;
            color: #64748b;
            margin: 0;
          }

          .stats-summary {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .stat-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 8px 14px;
            border-radius: 8px;
            min-width: 90px;
            flex: 1;
          }

          .stat-box.status-pending { border-left: 3.5px solid #d97706; }
          .stat-box.status-reviewing { border-left: 3.5px solid #7c3aed; }
          .stat-box.status-contacted { border-left: 3.5px solid #0284c7; }
          .stat-box.status-responded { border-left: 3.5px solid #059669; }
          .stat-box.status-approved { border-left: 3.5px solid #16a34a; }
          .stat-box.status-closed { border-left: 3.5px solid #64748b; }

          .stat-status {
            font-size: 9px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          }

          .stat-count {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
          }

          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }

          .data-table th {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 10px 12px;
            text-align: left;
            border: 1px solid #0f172a;
          }

          .data-table td {
            padding: 10px 12px;
            font-size: 11.5px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
            line-height: 1.4;
          }

          .data-table tr:nth-child(even) {
            background-color: #f8fafc;
          }

          .data-table tr {
            page-break-inside: avoid;
          }

          .enquiry-id {
            font-family: monospace;
            font-weight: 600;
            color: #475569;
          }

          .name-bold {
            font-weight: 700;
            color: #0f172a;
          }

          .sub-text {
            font-size: 9.5px;
            color: #64748b;
            margin-top: 2px;
            line-height: 1.3;
          }

          .interested-class {
            font-weight: 600;
            color: #0f172a;
          }

          .pref-badge {
            font-size: 9.5px;
            font-weight: 600;
            padding: 1.5px 5px;
            background: #f1f5f9;
            border-radius: 4px;
            color: #475569;
            display: inline-block;
          }

          .status-badge {
            font-size: 9px;
            font-weight: 700;
            padding: 2.5px 7px;
            border-radius: 12px;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .status-pending {
            background-color: #fef3c7;
            color: #b45309;
          }

          .status-reviewing {
            background-color: #f3e8ff;
            color: #6b21a8;
          }

          .status-contacted {
            background-color: #e0f2fe;
            color: #0369a1;
          }

          .status-responded {
            background-color: #ecfdf5;
            color: #047857;
          }

          .status-approved {
            background-color: #dcfce7;
            color: #15803d;
          }

          .status-closed {
            background-color: #f1f5f9;
            color: #475569;
          }

          .footer-container {
            margin-top: auto;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            font-size: 9.5px;
            color: #94a3b8;
            font-weight: 500;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="school-info">
            <h1>Noventra School</h1>
            <p>Empowering Minds, Shaping Futures · Admissions Office</p>
          </div>
          <div class="report-info">
            <div class="report-title">Admission Enquiries Report</div>
            <div class="report-date">Generated: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div class="stats-summary">
          <div class="stat-box" style="border-left: 3.5px solid #0f172a;">
            <div class="stat-status">Total Enquiries</div>
            <div class="stat-count">${enquiries.length}</div>
          </div>
          ${statsHtml}
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 12%">Enquiry ID</th>
              <th style="width: 23%">Student Details</th>
              <th style="width: 25%">Parent & Contact Info</th>
              <th style="width: 12%">Interested Class</th>
              <th style="width: 10%">Contact Pref</th>
              <th style="width: 10%">Status</th>
              <th style="width: 8%">Date</th>
            </tr>
          </thead>
          <tbody>
            ${
              rowsHtml ||
              '<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">No enquiries found.</td></tr>'
            }
          </tbody>
        </table>

        <div class="footer-container">
          <div>Noventra School Admission Management System · Confidential</div>
          <div>Report Generated Digitally</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
