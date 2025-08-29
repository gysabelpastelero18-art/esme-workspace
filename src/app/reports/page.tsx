'use client';

import { useState, useEffect } from 'react';

export default function Reports() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Mayon Branch');
  const [selectedDepartment, setSelectedDepartment] = useState('Bakery');

  useEffect(() => {
    setIsHydrated(true);
    // Set default week to current week (starting from Monday)
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 6 days from Monday, otherwise day - 1
    startOfWeek.setDate(today.getDate() - daysFromMonday);
    setSelectedWeek(startOfWeek.toISOString().split('T')[0]);
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  // Get week dates (Monday to Sunday)
  const getWeekDates = (startDate: string) => {
    const start = new Date(startDate);
    const dates = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        name: dayNames[i],
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return dates;
  };

  // Get week number (Monday-based)
  const getWeekNumber = (startDate: string) => {
    const start = new Date(startDate);
    const yearStart = new Date(start.getFullYear(), 0, 1);
    
    // Find the first Monday of the year
    const firstMonday = new Date(yearStart);
    const dayOfWeek = yearStart.getDay();
    const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    firstMonday.setDate(yearStart.getDate() + daysToMonday);
    
    // Calculate days between start date and first Monday
    const diffTime = start.getTime() - firstMonday.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate week number
    const weekNumber = Math.floor(diffDays / 7) + 1;
    
    // Handle edge case for dates before first Monday
    return weekNumber > 0 ? weekNumber : 52; // Previous year's last week
  };

  // Get all items for a department - ensures complete item lists are shown
  const getAllDepartmentItems = (department: string) => {
    switch (department) {
      case 'Commissary':
        return [
          'ADOBO DILAW CHICKEN THIGH', 'ADOBO FLAKES(300G)', 'ADOBO PUTI PORK LIEMPO(200G)',
          'BALBACUA OXTAIL 62GMS/ KENCHIE 62GMS', 'BATCHOY KASIM (150G)', 'BATCHOY PORK MASK',
          'BLUE MARLIN (270G)', 'FRAGRANCE BUTTER (450G)', 'BRICK CHICKEN', 'SHANK MEAT BULALO/CALDERETA',
          'BURNT SAUCE', 'GRILLED PORK', 'MAHI MAHI PREP', 'CALDERETA SAUCE', 'SQUID CALAMARES PREP',
          'CLUB CHICKEN PREP', 'GALANTINA', 'INASAL PREP', 'HAM (1KL)', 'BANGUS MARINADE',
          'CRISPY PATA PREP', 'TADYANG', 'BISTEK SAUCE', 'DINAMITA POPS MARINATION (2KG)', 'DINUGUAN',
          'FRIED CHICKEN', 'INIHAW PORK', 'BAGOONG', 'KARE KARE KENCHIE PREP 92GMS', 'KARE KARE OXTAIL PREP 92GRMS',
          'KARE KARE SAUCE 300GRMS', 'LAING (220G)', 'LASAGNA WHOLE', 'LECHON BELLY MARINATE', 'LECHON BELLY BAKED',
          'LECHON SAUCE', 'SAMPALOK (1KL)', 'NACHOS MEAT', 'CHICHARON FLOWER PREP', 'PALABOK SAUCE',
          'PALABOK MEAT', 'PINAHIGANG MANOK', 'ROAST BEEF', 'SALTED EGG CHICKEN', 'SISIG',
          'SQUID TINTA PREP', 'TINUMOK', 'GARLIC LONGGANISA 120G', 'SWEET LONGGA 120G', 'TORTA MEAT (100G)',
          'BINAGOONGAN (110G)', 'BBQ SAUCE', 'BONE MARROW', 'CHIMICHURI', 'SOFRITO'
        ];

      case 'Main Kitchen':
        return [
          'ADOBO DILAW CHICKEN THIGH', 'ADOBO FLAKES(300G)', 'ADOBO PUTI PORK LIEMPO(200G)',
          'BALBACUA OXTAIL 62GMS/ KENCHIE 62GMS', 'BATCHOY KASIM (150G)', 'BATCHOY PORK MASK',
          'BLUE MARLIN (270G)', 'FRAGRANCE BUTTER (450G)', 'BRICK CHICKEN', 'SHANK MEAT BULALO/CALDERETA',
          'BURNT SAUCE', 'GRILLED PORK', 'MAHI MAHI PREP', 'CALDERETA SAUCE', 'SQUID CALAMARES PREP',
          'CLUB CHICKEN PREP', 'GALANTINA', 'INASAL PREP', 'HAM (1KL)', 'BANGUS MARINADE',
          'CRISPY PATA PREP', 'TADYANG', 'BISTEK SAUCE', 'DINAMITA POPS MARINATION (2KG)', 'DINUGUAN',
          'FRIED CHICKEN', 'INIHAW PORK', 'BAGOONG', 'KARE KARE KENCHIE PREP 92GMS', 'KARE KARE OXTAIL  PREP 92GRMS',
          'KARE KARE SAUCE 300GRMS', 'LAING (220G)', 'LASAGNA WHOLE', 'LECHON BELLY MARINATE (# of slab)',
          'LECHON BELLY BAKED (# of slab)', 'LECHON SAUCE', 'SAMPALOK (1KL)', 'NACHOS MEAT', 'CHICHARON FLOWER PREP',
          'PALABOK SAUCE', 'PALABOK MEAT', 'PINAHIGANG MANOK', 'ROAST BEEF', 'SALTED EGG CHICKEN', 'SISIG',
          'SQUID TINTA PREP', 'TINUMOK', 'GARLIC LONGGANISA 120G', 'SWEET LONGGA 120G', 'TORTA MEAT (100G)',
          'BINAGOONGAN (110G)', 'BBQ SAUCE', 'BONE MARROW', 'CHIMICHURI', 'SOFRITO'
        ];

      case 'Bakery':
      default:
        // Only these items will show for Bakery
      return [
        // BREADS
        'BALIWAG BONETE',
        'BICHO BICHO',
        'BISCOCHO',
        'BRIOCHE LOAF',
        'CHEESE STREUSEL',
        'CHESSE PIMIENTO LOAF',
        'GARLIC BAGUETTE',
        'HERBED ROLL',
        'PANDESAL BIG',
        'RAISIN LOAF',
        'SOURDOUGH',
        'SPANISH BREAD',
        'ULTIMATE CHEESE ROLL',
        'WHOLE WHEAT LOAF',
        // CAKES
        'CASHEW SANSRIVAL 6',
        'CASHEW SANSRIVAL 8',
        'CHEESE CAKE GUAVA',
        'DAYAP TORE 4 mini',
        'DAYAP TORE 8 big',
        'ESPRESSO PRALINE MINI',
        'MANGO CREAM PIE',
        'MANGO TORTE 4 mini',
        'MANGO TORTE 8 big',
        'STRAWBERRY SHORTCAKE',
        'TSOKOLATE BATIROL 4 mini',
        'TSOKOLATE BATIROL 8 big',
        'UBE VELVET MINI',
        // COOKIES & PASTRIES
        'BANANA TOFFEE MUFFIN',
        'CHEESE CUPCAKE',
        'EMPANADA',
        'JAR CHOCO CHIPS',
        'JAR MANGO',
        'JAR ROCKY ROAD',
        'JAR TOFFEE',
        'JAR TSOKO PEANUT',
        'PECAN WALNUT TART',
        'STRAWBERRY TRES LECHES'
      ];
  }
};

  // Fetch production data for the selected week
  const fetchProductionData = async (weekStartDate: string, branch?: string, department?: string) => {
  setLoading(true);
  try {
    const weekDates = getWeekDates(weekStartDate);
    const allData = new Map<string, any>();

    // Use provided parameters or current state values
    const currentBranch = branch || selectedBranch;
    const currentDepartment = department || selectedDepartment;

    // Initialize all department items with zero values to ensure complete list
    const allItems = getAllDepartmentItems(currentDepartment);
    allItems.forEach(itemName => {
      allData.set(itemName, {
        item: itemName,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
        total: 0
      });
    });

    // Fetch data for each day of the week and populate actual values from database
    for (const dayInfo of weekDates) {
      try {
        const response = await fetch(`/api/production?date=${dayInfo.date}&branch=${currentBranch}&department=${currentDepartment}`);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.data && result.data.data) {
            // Process each item for this day and update values
            result.data.data.forEach((item: any) => {
              // Only update if item exists in our department's item list
              if (allData.has(item.item)) {
                const itemData = allData.get(item.item);
                itemData[dayInfo.name] = item.production || 0;
              }
              // Do NOT add items that are not in the department's item list
            });
          }
        }
      } catch (dayError) {
        console.error(`Error fetching data for ${dayInfo.date}:`, dayError);
      }
    }

    // Calculate totals and convert to array
    const processedData = Array.from(allData.values()).map(item => ({
      ...item,
      total: item.Sunday + item.Monday + item.Tuesday + item.Wednesday + item.Thursday + item.Friday + item.Saturday
    }));

    // Sort by item name - show complete list with actual database values
    const filteredData = processedData.sort((a, b) => a.item.localeCompare(b.item));
    
    setProductionData(filteredData);
  } catch (error) {
    console.error('Error fetching production data:', error);
    setProductionData([]);
  } finally {
    setLoading(false);
  }
};

  const handleReportClick = (reportType: string) => {
    if (reportType === 'Daily Production') {
      setSelectedReport('Daily Production');
      fetchProductionData(selectedWeek);
    } else if (reportType === 'Print Inventory') {
      window.location.href = '/inventory-quick-print-summary';
    }
  };

  const handleWeekChange = (newDate: string) => {
    // Convert the selected date to the Monday of that week
    const selectedDate = new Date(newDate);
    const dayOfWeek = selectedDate.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayOfWeek = new Date(selectedDate);
    mondayOfWeek.setDate(selectedDate.getDate() - daysFromMonday);
    const mondayString = mondayOfWeek.toISOString().split('T')[0];
    
    setSelectedWeek(mondayString);
    setSelectedDate(newDate);
    if (selectedReport === 'Daily Production') {
      fetchProductionData(mondayString);
    }
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    if (selectedReport === 'Daily Production') {
      fetchProductionData(selectedWeek, branch, selectedDepartment);
    }
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    if (selectedReport === 'Daily Production') {
      fetchProductionData(selectedWeek, selectedBranch, department);
    }
  };

  // Print function - Print selected branch and department only
  const handlePrint = () => {
  const printContent = document.querySelector('.production-table-container');
  if (printContent) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Daily Production Report - ${selectedBranch} ${selectedDepartment}</title>
            <style>
              @page { 
                size: Legal portrait;
                margin-top: 0.3in;
                margin-bottom: 1.63in;
                margin-left: 0.3in;
                margin-right: 0.3in;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 15px;
                font-size: 18px;
              }
              table { 
                width: 70%; 
                border-collapse: collapse; 
              }
              th, td { 
                border: 1px solid #d3d3d3; 
                padding: 8px; 
                text-align: center; 
              }
              td:first-child { 
                text-align: left; 
              }
              th { 
                background-color: #f5f5f5; 
                font-weight: bold; 
              }
              .header {
                text-align: center; 
                margin-bottom: 4px; /* Reduce space below title to move up branch/department, date, and table */
                margin-top: 0.02in;
                font-size: 18px;
              }
              .no-print { 
                display: none; 
              }
              @media print {
                body { 
                  margin: 0 !important;
                  padding: 10px !important;
                }
                .header {
                  margin-top: 0 !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Daily Production Report</h1>
              <h2 id="branch-dept-print" style="font-size:20px; font-weight:normal; color:#444; margin:1px 0 0 0;">${selectedBranch} - ${selectedDepartment}</h2>
              <p>From ${new Date(getWeekDates(selectedWeek)[0].date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })} to ${new Date(getWeekDates(selectedWeek)[6].date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }
};

  // Export to CSV function
  const handleExport = () => {
    if (productionData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Item', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Total'];
    // Add branch, department, and date as the first row
    const metaRow = [`Branch: ${selectedBranch}`, `Department: ${selectedDepartment}`, `Date: ${selectedDate}`].join(',');
    // Helper to convert 0, '0', or empty to '-'
    const dashIfZero = (val: any) => {
      if (val === undefined || val === null) return '-';
      if (typeof val === 'string' && (val.trim() === '' || val.trim() === '0')) return '-';
      if (typeof val === 'number' && val === 0) return '-';
      return val;
    };

    // Get week dates for the selected week
    const weekDates = getWeekDates(selectedWeek);
    const dateRow = [
      '',
      ...weekDates.map(d => d.date),
      '' // for Total column
    ].join(',');

    const csvContent = [
      metaRow,
      headers.join(','),
      dateRow,
      ...productionData.map(row => [
        `"${row.item}"`,
        dashIfZero(row.Monday),
        dashIfZero(row.Tuesday),
        dashIfZero(row.Wednesday),
        dashIfZero(row.Thursday),
        dashIfZero(row.Friday),
        dashIfZero(row.Saturday),
        dashIfZero(row.Sunday),
        dashIfZero(row.total)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Daily_Production_Report_${selectedBranch}_${selectedDepartment}_${selectedWeek}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e6f4ea 0%, #a7bca1 100%)',
          position: 'relative'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(156,175,136,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 40%, rgba(74,103,65,0.06) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(0,100,0,0.04) 0%, transparent 50%),
              linear-gradient(45deg, transparent 48%, rgba(156,175,136,0.02) 49%, rgba(156,175,136,0.02) 51%, transparent 52%)
            `,
            backgroundSize: '400px 400px, 600px 600px, 500px 500px, 100px 100px',
            pointerEvents: 'none'
          }}
        />

        <main 
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '32px 20px',
            position: 'relative',
            zIndex: 5
          }}
        >
          {/* Page Header */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(156,175,136,0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              padding: '32px',
              marginBottom: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '24px'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <h1 
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#006400',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  📊 Reports & Analytics
                </h1>
                <button
                  onClick={() => {
                    window.location.href = '/maindashboard';
                    if (typeof window !== 'undefined') {
                      window.location.replace('/maindashboard');
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #9CAF88, #4A6741)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(156,175,136,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'linear-gradient(135deg, #4A6741, #9CAF88)';
                    target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'linear-gradient(135deg, #9CAF88, #4A6741)';
                    target.style.transform = 'translateY(0)';
                  }}
                >
                  ← Back to Dashboard
                </button>
              </div>
              
              <p 
                style={{
                  color: '#4A6741',
                  fontSize: '16px',
                  margin: 0,
                  lineHeight: '1.5'
                }}
              >
                Comprehensive analytics and reports for business insights and decision making.
              </p>
            </div>
          </div>

          {/* Report Categories */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}
          >
            {[
              {
                icon: '📈',
                title: 'Sales Reports',
                description: 'Daily, Weekly, and Monthly sales analytics',
                color: '#4CAF50',
                items: ['Daily Sales Summary', 'Revenue Analysis', 'Top Products', 'Sales Trends']
              },
              {
                icon: '📦',
                title: 'Inventory Reports',
                description: 'Quick print previous inventory records',
                color: '#4A6741',
                items: ['Daily Inventory','Inventory Summary'],
              },
              {
                icon: '📊',
                title: 'Production Reports',
                description: 'Production efficiency and inventory tracking',
                color: '#FF9800',
                items: ['Weekly Production', 'Department Performance', 'Waste Analysis', 'Stock Levels']
              },
              {
                icon: '🏭',
                title: 'Purchases and Transfer Reports',
                description: 'Monitoring Purchases and Transfers',
                color: '#e6c38eff',
                items: ['Weekly Purchases', 'Weekly Transfers', 'Purchases vs Transfers']
              },
              {
                icon: '💰',
                title: 'Financial Reports',
                description: 'Profit & loss, expenses, and financial insights',
                color: '#2196F3',
                items: ['P&L Statement', 'Expense Breakdown', 'Cost Analysis', 'Budget vs Actual']
              },
              {
                icon: '📋',
                title: 'Operational Reports',
                description: 'Branch performance and operational metrics',
                color: '#9C27B0',
                items: ['Branch Comparison', 'Employee Performance', 'Customer Analytics', 'Operational KPIs']
              }
            ].map((category, index) => (
              <div 
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(156,175,136,0.2)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLDivElement;
                  target.style.transform = 'translateY(-4px)';
                  target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLDivElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    right: '-1px',
                    bottom: '-1px',
                    background: `linear-gradient(135deg, ${category.color}15, ${category.color}08)`,
                    borderRadius: '16px',
                    zIndex: -1
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: category.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: `0 6px 16px ${category.color}40`
                    }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: '#006400', fontSize: '18px', fontWeight: '700' }}>
                      {category.title}
                    </h3>
                    <p style={{ margin: 0, color: '#4A6741', fontSize: '14px' }}>
                      {category.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      onClick={() => {
                        if (category.title === 'Inventory Reports') {
                          if (item === 'Daily Inventory') {
                            window.location.href = '/inventory-quick-print-summary';
                          } else if (item === 'Inventory Summary') {
                            window.location.href = '/inventory-summary-reports';
                          }
                        } else {
                          handleReportClick(item);
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(156,175,136,0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#4A6741',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLDivElement;
                        target.style.background = 'rgba(156,175,136,0.2)';
                        target.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLDivElement;
                        target.style.background = 'rgba(156,175,136,0.1)';
                        target.style.transform = 'translateX(0)';
                      }}
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Daily Production Report View */}
          {selectedReport === 'Daily Production' && (
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(156,175,136,0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                padding: '32px',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  background: 'linear-gradient(135deg, rgba(255,152,0,0.1), rgba(255,152,0,0.05))',
                  borderRadius: '20px',
                  zIndex: -1
                }}
              />
              
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  padding: '24px'
                }}
              >
                {/* Report Header */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div 
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#FF9800',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: '0 6px 16px rgba(255,152,0,0.4)'
                      }}
                    >
                      📊
                    </div>
                    <div>
                      <h2 style={{ margin: '0 0 4px 0', color: '#006400', fontSize: '24px', fontWeight: '700' }}>
                        Daily Production Report
                      </h2>
                      <p style={{ margin: '0 0 4px 0', color: '#4A6741', fontSize: '14px' }}>
                        Weekly production quantities - {selectedBranch} • {selectedDepartment}
                      </p>
                      <p style={{ margin: 0, color: '#9CAF88', fontSize: '12px', fontStyle: 'italic' }}>
                        Shows {selectedDepartment === 'Main Kitchen' || selectedDepartment === 'Cashier' ? '"Del" (Delivery)' : '"Prod" (Production)'} column values from saved production records
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Date Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#4A6741', fontWeight: '500' }}>📅 Date:</span>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleWeekChange(e.target.value)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid #9CAF88',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          color: '#4A6741',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Branch Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#4A6741', fontWeight: '500' }}>🏪 Branch:</span>
                      <select 
                        value={selectedBranch}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid #9CAF88',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          color: '#4A6741',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Mayon Branch">Mayon Branch</option>
                        <option value="One Balete Branch">One Balete Branch</option>
                      </select>
                    </div>

                    {/* Department Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#4A6741', fontWeight: '500' }}>🏪 Department:</span>
                      <select 
  value={selectedDepartment}
  onChange={(e) => handleDepartmentChange(e.target.value)}
  style={{
    background: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid #9CAF88',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    color: '#4A6741',
    outline: 'none',
    cursor: 'pointer'
  }}
>
  <option value="Bakery">Bakery</option>
  <option value="Commissary">Commissary</option>
  <option value="Main Kitchen">Main Kitchen</option>
</select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'flex-end', 
                  marginBottom: '20px' 
                }}>
                  <button
                    onClick={handlePrint}
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(0)';
                    }}
                  >
                    🖨️ Print Report
                  </button>
                  <button
                    onClick={handleExport}
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #047857)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(0)';
                    }}
                  >
                    📥 Export CSV
                  </button>
                </div>

                {/* Production Table */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#4A6741' }}>
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
                    <p>Loading production data...</p>
                  </div>
                ) : (
                  <div className="production-table-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d3d3d3' }}>
                      <thead>
                        <tr style={{ 
                          borderBottom: '3px solid rgba(255,152,0,0.8)',
                          background: 'linear-gradient(135deg, rgba(255,152,0,0.15), rgba(255,152,0,0.1))'
                        }}>
                          <th style={{ 
                            textAlign: 'left', 
                            padding: '16px 12px', 
                            color: '#FF9800', 
                            fontWeight: '800', 
                            fontSize: '16px', // <-- FONT SIZE (HEADER: ITEM)
                            minWidth: '200px',
                            border: '1px solid #d3d3d3',
                            fontFamily: 'Arial, sans-serif',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}>Item</th>
                          {getWeekDates(selectedWeek).map((day) => (
                            <th key={day.name} style={{ 
                              textAlign: 'center', 
                              padding: '16px 8px', 
                              color: '#FF9800', 
                              fontWeight: '800', 
                              fontSize: '14px', // <-- FONT SIZE (HEADER: DAY)
                              width: '120px',
                              border: '1px solid #d3d3d3',
                              fontFamily: 'Arial, sans-serif',
                              letterSpacing: '0.5px'
                            }}>
                              <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '2px' }}>{day.name}</div> {/* <-- FONT SIZE (HEADER: DAY NAME) */}
                              <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>{/* <-- FONT SIZE (HEADER: DATE) */}
                                {new Date(day.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: '2-digit'
                                })}
                              </div>
                            </th>
                          ))}
                          <th style={{ 
                            textAlign: 'center', 
                            padding: '16px 8px', 
                            color: '#FF9800', 
                            fontWeight: '800', 
                            fontSize: '16px', // <-- FONT SIZE (HEADER: TOTAL)
                            width: '80px',
                            border: '1px solid #d3d3d3',
                            fontFamily: 'Arial, sans-serif',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            background: 'rgba(255,152,0,0.2)'
                          }}>Week {getWeekNumber(selectedWeek)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productionData.length > 0 ? productionData.map((row, index) => (
                          <tr 
                            key={index}
                            style={{ borderBottom: '1px solid rgba(255,152,0,0.2)' }}
                          >
                            <td style={{ 
                              padding: '12px', 
                              fontWeight: '600',
                              color:  '#90928fff',
                              border: '1px solid #d3d3d3',
                              background: '#fff',
                              textAlign: 'left'
                            }}>
                              {row.item}
                            </td>
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:  '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Monday || 0}</td> {/* <-- FONT SIZE (CELL: MONDAY) */}
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:  '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Tuesday || 0}</td> {/* <-- FONT SIZE (CELL: TUESDAY) */}
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:  '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Wednesday || 0}</td> {/* <-- FONT SIZE (CELL: WEDNESDAY) */}
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:   '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Thursday || 0}</td> {/* <-- FONT SIZE (CELL: THURSDAY) */}
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:  '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Friday || 0}</td> {/* <-- FONT SIZE (CELL: FRIDAY) */}
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:  '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Saturday || 0}</td> {/* <-- FONT SIZE (CELL: SATURDAY) */}
                            <td style={{ textAlign: 'center', padding: '12px 8px', color:  '#90928fff', fontWeight: '600', border: '1px solid #d3d3d3', fontSize: '15px' }}>{row.Sunday || 0}</td> {/* <-- FONT SIZE (CELL: SUNDAY) */}
                            <td style={{ 
                              textAlign: 'center', 
                              padding: '12px 8px', 
                              color: '#FF9800', 
                              fontWeight: '800',
                              fontSize: '15px', // <-- FONT SIZE (CELL: TOTAL)
                              background: 'rgba(255,152,0,0.1)',
                              border: '1px solid #d3d3d3'
                            }}>
                              {row.total || 0}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={9} style={{ 
                              textAlign: 'center', 
                              padding: '40px', 
                              color: '#9CAF88',
                              fontStyle: 'italic',
                              border: '1px solid #d3d3d3'
                            }}>
                              No production data available for {selectedBranch} - {selectedDepartment} during the selected week
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {productionData.length > 0 && (
  <tfoot>
    <tr style={{ 
      background: 'linear-gradient(135deg, rgba(255,152,0,0.2), rgba(255,152,0,0.15))', 
      fontWeight: 'bold',
      fontSize: '16px'
    }}>
      <td style={{ 
        padding: '16px 12px', 
        color: '#FF9800', 
        fontWeight: '900',
        fontFamily: 'Arial, sans-serif',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        border: '1px solid #d3d3d3'
      }}>TOTALS</td>
      {getWeekDates(selectedWeek).map((day) => (
        <td key={day.name} style={{ 
          textAlign: 'center', 
          padding: '12px 8px', 
          color: '#FF9800', 
          fontWeight: '800',
          border: '1px solid #d3d3d3'
        }}>
          {
            productionData.reduce((sum, item) => {
              // Use the actual day name as key, fallback to 0 if undefined
              const value = item[day.name];
              return sum + (typeof value === 'number' ? value : 0);
            }, 0)
          }
        </td>
      ))}
      <td style={{ 
        textAlign: 'center', 
        padding: '12px 8px', 
        color: '#FF9800', 
        fontWeight: '800',
        fontSize: '15px',
        background: 'rgba(255,152,0,0.3)',
        border: '1px solid #d3d3d3'
      }}>
        {
          productionData.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0)
        }
      </td>
    </tr>
  </tfoot>
)}
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
