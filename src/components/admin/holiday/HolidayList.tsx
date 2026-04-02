'use client';

import React from 'react';
import { formatDate } from '@/utils/FormatDate';
import type { PublicHoliday } from '@/services/admin/HolidayService';
import HolidayRowSkeleton from './HolidayRowSkeleton';

interface HolidayListProps {
  holidays: PublicHoliday[];
  loading?: boolean;
}

const HolidayList: React.FC<HolidayListProps> = ({ holidays, loading = false }) => {
  const rows = holidays ?? [];

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
      <div className='overflow-x-auto w-full'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <div className='max-h-[70vh] overflow-y-auto w-full'>
              <table className='w-full text-sm text-gray-800 table-fixed'>
                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                  <tr>
                    <th className='py-3 px-4 text-center w-20'>STT</th>
                    <th className='py-3 px-4 text-left'>Tên</th>
                    <th className='py-3 px-4 text-left w-[280px]'>Ghi chú</th>
                    <th className='py-3 px-4 text-center w-40 whitespace-nowrap'>Từ ngày</th>
                    <th className='py-3 px-4 text-center w-40 whitespace-nowrap'>Đến ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => <HolidayRowSkeleton key={idx} />)
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className='py-8 text-center text-gray-400'>
                        Không có ngày nghỉ
                      </td>
                    </tr>
                  ) : (
                    rows.map((h, idx) => {
                      const isLast = idx === rows.length - 1;
                      const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                      return (
                        <tr key={h.publicHolidayId || idx} className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
                          <td className='py-3 px-4 text-center'>
                            <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                              {idx + 1}
                            </span>
                          </td>
                          <td className='py-3 px-4 font-medium text-gray-900 truncate' title={h.name}>
                            {h.name || 'N/A'}
                          </td>
                          <td className='py-3 px-4 truncate' title={h.description || ''}>
                            {h.description || ''}
                          </td>
                          <td className='py-3 px-4 text-center whitespace-nowrap'>{formatDate(h.startDate)}</td>
                          <td className='py-3 px-4 text-center whitespace-nowrap'>{formatDate(h.endDate)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayList;
