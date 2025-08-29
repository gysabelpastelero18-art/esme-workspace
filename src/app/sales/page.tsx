'use client'

import React, { useState } from 'react';
import { default as HtmlDailyReport } from '../../components/HtmlDailyReport';

export default function SalesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-31');
  const [dateRange, setDateRange] = useState('This Week');
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [selectedReportBranch, setSelectedReportBranch] = useState<'mayon' | 'balete' | null>(null);

  // Get branch comparison data
  // Helper to show dash for zero or empty
  const dashIfZero = (val: any) => {
    if (val === undefined || val === null) return '-';
    if (typeof val === 'string' && (val.trim() === '' || val.trim() === '₱0' || val.trim() === '0')) return '-';
    if (typeof val === 'number' && val === 0) return '-';
    return val;
  };

  const getBranchComparisonData = () => {
    // All values set to zero or empty to simulate no imported/inputted sales
    return {
      mayon: {
        name: 'Mayon Branch',
        totalSales: '-',
        orders: '-',
        revenue: '-',
        growth: '-',
        categories: [
          { category: '🥖 Bakery', units: '-', revenue: '-', growth: '-' },
          { category: '🥤 Beverages', units: '-', revenue: '-', growth: '-' },
          { category: '🥘 Commissary', units: '-', revenue: '-', growth: '-' },
          { category: '🍰 Desserts', units: '-', revenue: '-', growth: '-' },
          { category: '🍳 Kitchen Items', units: '-', revenue: '-', growth: '-' },
          { category: '🍽️ Others: Corkage', units: '-', revenue: '-', growth: '-' },
          { category: '🚚 Others: Delivery Fee', units: '-', revenue: '-', growth: '-' },
          { category: '⭐ Others: Service Charge', units: '-', revenue: '-', growth: '-' }
        ]
      },
      balete: {
        name: 'One Balete Branch',
        totalSales: '-',
        orders: '-',
        revenue: '-',
        growth: '-',
        categories: [
          { category: '🥖 Bakery', units: '-', revenue: '-', growth: '-' },
          { category: '🥤 Beverages', units: '-', revenue: '-', growth: '-' },
          { category: '🥘 Commissary', units: '-', revenue: '-', growth: '-' },
          { category: '🍰 Desserts', units: '-', revenue: '-', growth: '-' },
          { category: '🍳 Kitchen Items', units: '-', revenue: '-', growth: '-' },
          { category: '🍽️ Others: Corkage', units: '-', revenue: '-', growth: '-' },
          { category: '🚚 Others: Delivery Fee', units: '-', revenue: '-', growth: '-' },
          { category: '⭐ Others: Service Charge', units: '-', revenue: '-', growth: '-' }
        ]
      }
    };
  };

  const branchData = getBranchComparisonData();

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #e8f5e8 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #9CAF88 0%, #4A6741 100%)',
        color: 'white',
        padding: '30px 20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            textAlign: 'center'
          }}>
            📊 Sales Dashboard
          </h1>
          <p style={{ 
            fontSize: '18px', 
            margin: 0, 
            opacity: 0.9,
            textAlign: 'center'
          }}>
            Branch Comparison & Analytics
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>

        {/* Date Range Selector */}
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          borderRadius: '20px', 
          padding: '30px', 
          marginBottom: '30px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: 'bold', 
            color: '#2d3748', 
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            📅 Select Analysis Period
          </h3>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {['Today', 'This Week', 'This Month', 'Last Month', 'This Quarter', 'Custom Range'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  background: selectedPeriod === period 
                    ? 'linear-gradient(135deg, #9CAF88, #4A6741)' 
                    : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  color: selectedPeriod === period ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedPeriod === period 
                    ? '0 8px 20px rgba(156,175,136,0.3)' 
                    : '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  if (selectedPeriod !== period) {
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  if (selectedPeriod !== period) {
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }
                }}
              >
                {period}
              </button>
            ))}
          </div>

          {selectedPeriod === 'Custom Range' && (
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#495057', 
                  marginBottom: '8px' 
                }}>
                  Start Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#495057', 
                  marginBottom: '8px' 
                }}>
                  End Date:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '25px', 
          marginBottom: '40px' 
        }}>
          {/* Mayon Branch Card */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '30px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(156,175,136,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(156,175,136,0.1), rgba(74,103,65,0.1))',
              borderRadius: '50%',
              transform: 'translate(40px, -40px)'
            }} />
            
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: 'bold', 
              color: '#2d3748', 
              margin: '0 0 20px 0',
              position: 'relative',
              zIndex: 1
            }}>
              🏪 {branchData.mayon.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Total Sales</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#006400', margin: 0 }}>{branchData.mayon.totalSales}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Growth</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2E7D32', margin: 0 }}>{branchData.mayon.growth}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Orders</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#006400', margin: 0 }}>{branchData.mayon.orders}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Revenue</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#006400', margin: 0 }}>{branchData.mayon.revenue}</p>
              </div>
            </div>
          </div>

          {/* One Balete Branch Card */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '30px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(156,175,136,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(156,175,136,0.1), rgba(74,103,65,0.1))',
              borderRadius: '50%',
              transform: 'translate(40px, -40px)'
            }} />
            
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: 'bold', 
              color: '#2d3748', 
              margin: '0 0 20px 0',
              position: 'relative',
              zIndex: 1
            }}>
              🏪 {branchData.balete.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Total Sales</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#006400', margin: 0 }}>{branchData.balete.totalSales}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Growth</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2E7D32', margin: 0 }}>{branchData.balete.growth}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Orders</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#006400', margin: 0 }}>{branchData.balete.orders}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', fontWeight: '500' }}>Revenue</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#006400', margin: 0 }}>{branchData.balete.revenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '30px', 
          marginBottom: '40px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#2d3748', 
            margin: '0 0 30px 0',
            textAlign: 'center'
          }}>
            ⚡ Quick Actions
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {[
              { 
                icon: '📝', 
                title: 'Input Daily Sales', 
                desc: 'Add daily sales data', 
                color: '#9CAF88',
                action: () => {
                  const branchChoice = confirm('📊 Select Branch for Daily Sales Input\n\nClick OK for Mayon Branch\nClick Cancel for One Balete Branch');
                  
                  if (branchChoice) {
                    setSelectedReportBranch('mayon');
                  } else {
                    setSelectedReportBranch('balete');
                  }
                  setShowDailyReport(true);
                }
              },
              { 
                icon: '📊', 
                title: 'View Analytics', 
                desc: 'Detailed analytics', 
                color: '#006400',
                action: () => {
                  const analyticsData = `Combined Analytics:\n\n` +
                    `Total Sales: ₱${(parseInt(branchData.mayon.totalSales.replace(/[₱,]/g, '')) + parseInt(branchData.balete.totalSales.replace(/[₱,]/g, ''))).toLocaleString()}\n` +
                    `Total Orders: ${branchData.mayon.orders + branchData.balete.orders}\n` +
                    `Average Growth: 12.5%\n\n` +
                    `Mayon Branch: ${branchData.mayon.totalSales} (${branchData.mayon.growth})\n` +
                    `One Balete Branch: ${branchData.balete.totalSales} (${branchData.balete.growth})`;
                  
                  alert(analyticsData);
                }
              }
            ].map((action, index) => (
              <div 
                key={index}
                onClick={action.action}
                style={{
                  background: `linear-gradient(135deg, ${action.color}, ${action.color}DD)`,
                  borderRadius: '16px',
                  padding: '24px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  boxShadow: `0 8px 20px ${action.color}40`
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(-8px)';
                  target.style.boxShadow = `0 15px 35px ${action.color}50`;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = `0 8px 20px ${action.color}40`;
                }}
              >
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '16px', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px auto',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '32px' }}>{action.icon}</div>
                </div>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px 0' }}>{action.title}</h3>
                  <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'linear-gradient(135deg, #9CAF88, #4A6741)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(156,175,136,0.3)'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translateY(-3px)';
              target.style.boxShadow = '0 12px 25px rgba(156,175,136,0.4)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 8px 20px rgba(156,175,136,0.3)';
            }}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>

      {/* HtmlDailyReport Modal */}
      {showDailyReport && selectedReportBranch && (
        <HtmlDailyReport
          selectedBranch={selectedReportBranch}
          onClose={() => {
            setShowDailyReport(false);
            setSelectedReportBranch(null);
          }}
        />
      )}
    </div>
  );
}
