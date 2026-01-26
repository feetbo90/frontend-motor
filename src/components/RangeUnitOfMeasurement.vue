<template>
  <div class="container">
    <MessageAlert
      type="warning"
      title="Perhatian!"
      message="Pastikan filter range yang Anda pilih sudah sesuai agar data yang ditampilkan akurat."
    />

    <!-- Range Filter -->
    <div class="range-filter-section">
      <h3>Filter Range Periode</h3>
      <p class="range-info">
        <i class="fas fa-info-circle"></i>
        Tahun diambil dari filter sidebar. Pilih range bulan di bawah ini.
      </p>
      <div class="filter-row">
        <div class="filter-group">
          <FormSelect
            id="start-month"
            label="Bulan Mulai"
            v-model="startMonth"
            placeholder="Pilih Bulan Mulai"
            :options="monthOptions"
            :allowEmpty="true"
            @update:modelValue="clearMonthError"
          />
        </div>
        <div class="filter-group">
          <FormSelect
            id="end-month"
            label="Bulan Akhir"
            v-model="endMonth"
            placeholder="Pilih Bulan Akhir"
            :options="monthOptions"
            :allowEmpty="true"
            @update:modelValue="clearMonthError"
          />
        </div>
        <div class="filter-group">
          <button @click="applyRangeFilter" class="btn-apply" type="button">
            <i class="fas fa-filter"></i>
            Terapkan Filter
          </button>
        </div>
      </div>
      <p v-if="monthRangeError" class="error-text">{{ monthRangeError }}</p>
    </div>

    <!--RATE -->
    <div class="section-header">
      <h2>Tingkat Produksi (Rata - rata) - Range</h2>
      <p>Analisis rata-rata pembiayaan, penjualan, markup, gaji, beban, dan laba/rugi dalam periode range</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="apiData.entityIds.length < 1" class="empty-container">
      <img src="/images/empty.png" alt="Empty State" width="400" height="400" />
      <p class="empty">Satuan pengukuran (Rata-rate) tidak ditemukan!</p>
    </div>
    <div v-else>
      <div v-for="entity in apiData.entityIds" :key="entity.id" class="entity-card">
        <!-- Header Collapsible -->
        <div class="entity-header" @click="toggleCollapse(`rate-${entity.id}`)">
          <span class="entity-name">{{ entity.name }} ({{ entity.type }})</span>
          <span class="arrow" :class="{ rotated: !collapsed[`rate-${entity.id}`] }">&#9654;</span>
        </div>

        <!-- Collapsible Content -->
        <transition name="slide-fade">
          <div v-show="!collapsed[`rate-${entity.id}`]" class="entity-content">
            <!-- Rate 1: Rata-rata Pembiayaan / Unit Penjualan -->
            <div class="metric-card">
              <div class="card-header blue">Rata-rata Pembiayaan / Unit Penjualan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Pembiayaan</th>
                      <th>Total Unit Jual</th>
                      <th>Pembiayaan / Unit Penjualan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateSatu(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Pembiayaan / Unit Penjualan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateSatu(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_pembiayaan)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_unit_jual)) }}</td>
                      <td>{{ formatCurrency(Number(item.pembiayaan_per_unit)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 2: Rata-rata Penjualan / Unit Penjualan -->
            <div class="metric-card">
              <div class="card-header green">Rata-rata Penjualan / Unit Penjualan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Penjualan</th>
                      <th>Total Unit</th>
                      <th>Penjualan / Unit Penjualan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateDua(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Penjualan / Unit Penjualan tidak ditemukan.
                      </td>
                    </tr>
                    <tr v-for="item in getRateDua(entity.name)" :key="`${item.year}-${item.month}`">
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_penjualan)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_unit)) }}</td>
                      <td>{{ formatCurrency(Number(item.penjualan_per_unit)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 3: Rata-rata Penjualan / Karyawan -->
            <div class="metric-card">
              <div class="card-header yellow">Rata-rata Penjualan / Karyawan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Penjualan</th>
                      <th>Jumlah Karyawan</th>
                      <th>Penjualan / Karyawan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateTiga(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Penjualan / Karyawan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateTiga(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_penjualan)) }}</td>
                      <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                      <td>{{ formatCurrency(Number(item.penjualan_per_karyawan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 4: Rata-rata Mark up / Karyawan -->
            <div class="metric-card">
              <div class="card-header purple">Rata-rata Mark up / Karyawan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Markup</th>
                      <th>Jumlah Karyawan</th>
                      <th>Markup / Karyawan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateEmpat(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Mark up / Karyawan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateEmpat(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_markup)) }}</td>
                      <td>
                        {{
                          typeof item.jumlah_karyawan === "string"
                            ? Number(item.jumlah_karyawan)
                            : item.jumlah_karyawan || item.total_karyawan || 0
                        }}
                      </td>
                      <td>
                        {{
                          formatCurrency(Number(item.rate_empat || item.markup_per_karyawan || 0))
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 5: Rata-rata Gaji / Karyawan -->
            <div class="metric-card">
              <div class="card-header blue">Rata-rata Gaji / Karyawan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Gaji</th>
                      <th>Jumlah Karyawan</th>
                      <th>Gaji / Karyawan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateLima(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Gaji / Karyawan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateLima(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.gaji || item.total_gaji || 0)) }}</td>
                      <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                      <td>{{ formatCurrency(Number(item.rate_gaji_per_karyawan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 6: Rata-rata Biaya Operasional / Karyawan -->
            <div class="metric-card">
              <div class="card-header green">Rata-rata Biaya Operasional / Karyawan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Beban Operasional</th>
                      <th>Jumlah Karyawan</th>
                      <th>Biaya Operasional / Karyawan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateEnam(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Biaya Operasional / Karyawan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateEnam(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>
                        {{
                          formatCurrency(
                            Number(item.beban_umum_operasional) ||
                              Number(item.total_beban_umum_operasional) ||
                              0,
                          )
                        }}
                      </td>
                      <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                      <td>
                        {{ formatCurrency(Number(item.rate_beban_umum_operasional_per_karyawan)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 7: Rata-rata Beban Tetap / Karyawan -->
            <div class="metric-card">
              <div class="card-header yellow">Rata-rata Beban Tetap / Karyawan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Penyusutan Aktiva</th>
                      <th>Jumlah Karyawan</th>
                      <th>Beban Tetap / Karyawan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateTujuh(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Beban Tetap / Karyawan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateTujuh(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>
                        {{
                          formatCurrency(
                            Number(item.penyusutan || item.total_penyusutan_aktiva || 0),
                          )
                        }}
                      </td>
                      <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                      <td>
                        {{ formatCurrency(Number(item.rate_penyusutan_aktiva_per_karyawan)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 8: Rata-rata Beban Tetap / Satuan Kerja -->
            <div class="metric-card">
              <div class="card-header purple">Rata-rata Beban Tetap / Satuan Kerja</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Penyusutan Aktiva</th>
                      <th>Total Unit</th>
                      <th>Beban Tetap / Satuan Kerja</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateDelapan(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Beban Tetap / Satuan Kerja tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateDelapan(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_penyusutan_aktiva)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_unit)) }}</td>
                      <td>{{ formatCurrency(Number(item.rate_penyusutan_aktiva_per_unit)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 9: Rata-rata Beban PH dan Penyusutan / Satuan Kerja -->
            <div class="metric-card">
              <div class="card-header blue">Rata-rata Beban PH dan Penyusutan / Satuan Kerja</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Penyusutan Aktiva</th>
                      <th>Total Cadangan Piutang</th>
                      <th>Total Cadangan Stock</th>
                      <th>Total Unit</th>
                      <th>Beban PH dan Penyusutan / Satuan Kerja</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateSembilan(entity.name).length === 0">
                      <td :colspan="6" class="empty">
                        Data Rata-rata Beban PH dan Penyusutan / Satuan Kerja tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateSembilan(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_penyusutan_aktiva)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_cadangan_piutang)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_cadangan_stock)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_unit)) }}</td>
                      <td>
                        {{ formatCurrency(Number(item.rate_penyusutan_dan_cadangan_per_unit)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 10: Rata-rata Laba/rugi nett / Satuan Kerja -->
            <div class="metric-card">
              <div class="card-header green">Rata-rata Laba/rugi nett / Satuan Kerja</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Kumulatif</th>
                      <th>Total Unit</th>
                      <th>Laba/rugi nett / Satuan Kerja</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateSepuluh(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Laba/rugi nett / Satuan Kerja tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateSepuluh(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_kumulatif)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_unit)) }}</td>
                      <td>{{ formatCurrency(Number(item.kumulatif_per_unit)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rate 11: Rata-rata Laba/rugi nett / Karyawan -->
            <div class="metric-card">
              <div class="card-header yellow">Rata-rata Laba/rugi nett / Karyawan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Kumulatif</th>
                      <th>Total Karyawan</th>
                      <th>Laba/rugi nett / Karyawan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRateSebelas(entity.name).length === 0">
                      <td :colspan="4" class="empty">
                        Data Rata-rata Laba/rugi nett / Karyawan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRateSebelas(entity.name)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_kumulatif)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_karyawan)) }}</td>
                      <td>{{ formatCurrency(Number(item.kumulatif_per_karyawan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- RATIO -->
    <div class="section-header" style="margin-top: 20px">
      <h2>Ratio Produksi - Range</h2>
      <p>Analisis rasio pembiayaan, penjualan, markup, gaji, beban, dan laba/rugi dalam periode range</p>
    </div>
    <div v-if="apiRatioData.entityIds.length < 1" class="empty-container">
      <img src="/images/empty.png" alt="Empty State" width="400" height="400" />
      <p class="empty">Satuan pengukuran (Rasio) tidak ditemukan!</p>
    </div>
    <div v-else>
      <div v-for="entity in apiRatioData.entityIds" :key="entity.id" class="entity-card">
        <!-- Header Collapsible -->
        <div class="entity-header" @click="toggleCollapse(`ratio-${entity.id}`)">
          <span class="entity-name">{{ entity.name }} ({{ entity.type }})</span>
          <span class="arrow" :class="{ rotated: !collapsed[`ratio-${entity.id}`] }">&#9654;</span>
        </div>
        <!-- Collapsible Content -->
        <transition name="slide-fade">
          <div v-show="!collapsed[`ratio-${entity.id}`]" class="entity-content">
            <!-- Rasio Pembiayaan & Realisasi Pokok -->
            <div class="metric-card">
              <div class="card-header blue">Ratio Pembiayaan / Realisasi Pokok</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Pembiayaan</th>
                      <th>Realisasi Pokok</th>
                      <th>Pembiayaan / Realisasi Pokok</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioSatu(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Pembiayaan / Realisasi Pokok tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioSatu(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.pembiayaan)) }}</td>
                      <td>{{ formatCurrency(Number(item.realisasi_pokok)) }}</td>
                      <td>{{ formatPercentage(Number(item.pembiayaan_per_realisasi_pokok)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Kn /T Kemacetan / Pembiayaan -->
            <div class="metric-card">
              <div class="card-header green">Ratio Kn /T Kemacetan / Pembiayaan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Kenaikan Macet</th>
                      <th>Pembiayaan</th>
                      <th>Ratio Kemacetan / Pembiayaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioDua(entity.name, entity.type).length === 0">
                      <td :colspan="5" class="empty">
                        Data Ratio Kn /T Kemacetan / Pembiayaan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioDua(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.cadangan_piutang)) }}</td>
                      <td>{{ formatCurrency(Number(item.tambahan)) }}</td>
                      <td>{{ formatPercentage(Number(item.rasio_kemacetan_pembiayaan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Mark up / Pembiayaan -->
            <div class="metric-card">
              <div class="card-header yellow">Ratio Mark up / Pembiayaan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Total Markup</th>
                      <th>Pembiayaan</th>
                      <th>Ratio Markup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioTiga(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Mark up / Pembiayaan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioTiga(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.total_markup)) }}</td>
                      <td>{{ formatCurrency(Number(item.pembiayaan)) }}</td>
                      <td>{{ formatPercentage(Number(item.rasio_markup)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Pendapatan Bunga / So. Piutang Akhir -->
            <div class="metric-card">
              <div class="card-header purple">Ratio Pendapatan Bunga / So. Piutang Akhir</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Realisasi Bunga</th>
                      <th>Total Piutang</th>
                      <th>Ratio Realisasi Bunga / Total Piutang</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioEmpat(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Pendapatan Bunga / So. Piutang Akhir tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioEmpat(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.realisasi_bunga)) }}</td>
                      <td>{{ formatCurrency(Number(item.total)) }}</td>
                      <td>
                        {{ formatPercentage(Number(item.rasio_realisasi_bunga_per_total_piutang)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Mark up / Jumlah Pendapatan -->
            <div class="metric-card">
              <div class="card-header blue">Ratio Mark up / Jumlah Pendapatan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Total Markup</th>
                      <th>Ratio Markup / Jumlah Pendapatan </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioLima(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Mark up / Jumlah Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioLima(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.total_markup)) }}</td>
                      <td>{{ formatPercentage(Number(item.rasio_markup_per_jumlah_pendapatan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Pendapatan Bunga / Jumlah Pendapatan -->
            <div class="metric-card">
              <div class="card-header green">Ratio Pendapatan Bunga / Jumlah Pendapatan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Realisasi Bunga</th>
                      <th>Ratio Pendapatan Bunga / Jumlah Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioEnam(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Pendapatan Bunga / Jumlah Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioEnam(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.realisasi_bunga)) }}</td>
                      <td>
                        {{
                          formatPercentage(Number(item.rasio_pendapatan_bunga_per_jumlah_pendapatan))
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Pendapatan Lainnya / Jumlah Pendapatan -->
            <div class="metric-card">
              <div class="card-header yellow">Rasio Pendapatan Lainnya / Jumlah Pendapatan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Pendapatan Lainnya</th>
                      <th>Rasio Pendapatan Lainnya / Jumlah Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioTujuh(entity.name, entity.type).length === 0">
                      <td :colspan="6" class="empty">
                        Data Ratio Pendapatan Lainnya / Jumlah Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioTujuh(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan_lain)) }}</td>
                      <td>
                        {{
                          formatPercentage(
                            Number(item.rasio_pendapatan_lainnya_per_jumlah_pendapatan),
                          )
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Gaji / Pendapatan -->
            <div class="metric-card">
              <div class="card-header purple">Ratio Gaji / Pendapatan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Gaji</th>
                      <th>Ratio Gaji / Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioDelapan(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Gaji / Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioDelapan(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.gaji)) }}</td>
                      <td>{{ formatPercentage(Number(item.rasio_gaji_per_pendapatan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Biaya Admin dan operasi / Pendapatan -->
            <div class="metric-card">
              <div class="card-header blue">Ratio Biaya Admin dan operasi / Pendapatan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Beban Umum Operasional</th>
                      <th>Ratio Beban Operasional / Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioSembilan(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Biaya Admin dan operasi / Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioSembilan(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.beban_umum_operasional)) }}</td>
                      <td>{{formatPercentage(Number(item.rasio_beban_operasional_per_pendapatan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Biaya Tetap (Penyusutan ) / Pendapatan -->
            <div class="metric-card">
              <div class="card-header green">Ratio Biaya Tetap (Penyusutan) / Pendapatan</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Penyusutan Aktiva</th>
                      <th>Ratio Penyusutan Aktiva / Jumlah Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioSepuluh(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Biaya Tetap (Penyusutan) / Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioSepuluh(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.penyusutan_aktiva)) }}</td>
                      <td>{{ formatPercentage(Number(item.rasio_penyusutan_aktiva_per_jumlah_pendapatan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rasio Biaya Tidak Tetap (Ph.p/stock ) / Pendapatan -->
            <div class="metric-card">
              <div class="card-header yellow">
                Ratio Biaya Tidak Tetap (Ph.p/stock) / Pendapatan
              </div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Bulan / Tahun</th>
                      <th>Jumlah Pendapatan</th>
                      <th>Cadangan Ph.p/stock</th>
                      <th>Ratio Cadangan Piutang / Jumlah Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="getRasioSebelas(entity.name, entity.type).length === 0">
                      <td :colspan="4" class="empty">
                        Data Ratio Biaya Tidak Tetap (Ph.p/stock) / Pendapatan tidak ditemukan.
                      </td>
                    </tr>
                    <tr
                      v-for="item in getRasioSebelas(entity.name, entity.type)"
                      :key="`${item.year}-${item.month}`"
                    >
                      <td>{{ item.month }}/{{ item.year }}</td>
                      <td>{{ formatCurrency(Number(item.jumlah_pendapatan)) }}</td>
                      <td>{{ formatCurrency(Number(item.cadangan_piutang)) }}</td>
                      <td>{{ formatPercentage(Number(item.rasio_cadangan_piutang_per_jumlah_pendapatan)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from "@/composables/useDate";
import { getProductRateRange, getProductRatioRange } from "@/services/productRateService";
import { useAuthStore } from "@/stores/auth";
import {
  formatCurrency,
  formatPercentage,
  isGlobalLoading,
  selectedEntityId,
  selectedYear,
} from "@/stores/globalState";
import type { entityIds, ProductRateData, ProductRatioData } from "@/types/productRate";
import { onMounted, reactive, ref, watch } from "vue";
import FormSelect from "./FormSelect.vue";
import MessageAlert from "./ui/MessageAlert.vue";

const authStore = useAuthStore();
const { monthOptions, currentMonth } = useDate();

// Range filter state - hanya bulan mulai dan akhir, tahun dari sidebar
// Default: bulan berjalan untuk kedua filter
const startMonth = ref<string | number>(currentMonth);
const endMonth = ref<string | number>(currentMonth);
const monthRangeError = ref<string>("");

const apiData = ref<ProductRateData>({
  success: false,
  entity_id: "",
  entityIds: [],
  rate_satu: {},
  rate_dua: {},
  rate_tiga: {},
  rate_empat: {},
  rate_lima: {},
  rate_enam: {},
  rate_tujuh: {},
});

const apiRatioData = ref<ProductRatioData>({
  success: false,
  entity_id: "",
  entityIds: [],
  rasioSatu: {},
  rasioDua: {},
  rasioTiga: {},
  rasioEmpat: {},
  rasioLima: {},
  rasioEnam: {},
  rasioTujuh: {},
  rasioDelapan: {},
  rasioSembilan: {},
  rasioSepuluh: {},
  rasioSebelas: {},
});

const loading = ref(false);

// Collapsed state per entity
const collapsed = reactive<Record<string, boolean>>({});

const toggleCollapse = (id: string) => {
  collapsed[id] = !collapsed[id];
};
// Helper methods to get rate data (with cabang support) 
const getRateSatu = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_satu || []
    : apiData.value.rate_satu[entityName] || [];
};

const getRateDua = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang ? apiData.value.cabang?.rate_dua || [] : apiData.value.rate_dua[entityName] || [];
};

const getRateTiga = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_tiga || []
    : apiData.value.rate_tiga[entityName] || [];
};

const getRateEmpat = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_empat || []
    : apiData.value.rate_empat[entityName] || [];
};

const getRateLima = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_lima || []
    : apiData.value.rate_lima[entityName] || [];
};

const getRateEnam = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_enam || []
    : apiData.value.rate_enam[entityName] || [];
};

const getRateTujuh = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_tujuh || []
    : apiData.value.rate_tujuh[entityName] || [];
};

const getRateDelapan = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_delapan || []
    : apiData.value.rate_delapan?.[entityName] || [];
};

const getRateSembilan = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_sembilan || []
    : apiData.value.rate_sembilan?.[entityName] || [];
};

const getRateSepuluh = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_sepuluh || []
    : apiData.value.rate_sepuluh?.[entityName] || [];
};

const getRateSebelas = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_sebelas || []
    : apiData.value.rate_sebelas?.[entityName] || [];
};

const getRasioSatu = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioSatu || []
    : apiRatioData.value.rasioSatu[entityName] || [];
};

const getRasioDua = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioDua || []
    : apiRatioData.value.rasioDua[entityName] || [];
};

const getRasioTiga = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioTiga || []
    : apiRatioData.value.rasioTiga[entityName] || [];
};

const getRasioEmpat = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioEmpat || []
    : apiRatioData.value.rasioEmpat[entityName] || [];
};

const getRasioLima = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioLima || []
    : apiRatioData.value.rasioLima[entityName] || [];
};

const getRasioEnam = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioEnam || []
    : apiRatioData.value.rasioEnam[entityName] || [];
};

const getRasioTujuh = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioTujuh || []
    : apiRatioData.value.rasioTujuh[entityName] || [];
};

const getRasioDelapan = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioDelapan || []
    : apiRatioData.value.rasioDelapan[entityName] || [];
};

const getRasioSembilan = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioSembilan || []
    : apiRatioData.value.rasioSembilan[entityName] || [];
};

const getRasioSepuluh = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioSepuluh || []
    : apiRatioData.value.rasioSepuluh[entityName] || [];
};

const getRasioSebelas = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioSebelas || []
    : apiRatioData.value.rasioSebelas[entityName] || [];
};

const fetchRateListRange = async (year: number, monthStart: number, monthEnd: number) => {
  try {
    const response = await getProductRateRange({
      year,
      month_start: monthStart,
      month_end: monthEnd,
      branch_id: Number(selectedEntityId.value) ?? undefined,
    });
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const fetchRatioListRange = async (year: number, monthStart: number, monthEnd: number) => {
  try {
    const response = await getProductRatioRange({
      year,
      month_start: monthStart,
      month_end: monthEnd,
      branch_id: Number(selectedEntityId.value) ?? undefined,
    });
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Clear error when user changes month input
const clearMonthError = () => {
  monthRangeError.value = "";
};

const applyRangeFilter = async () => {
  // Clear previous errors
  monthRangeError.value = "";

  if (!selectedYear.value) {
    monthRangeError.value = "Silakan pilih tahun di filter sidebar terlebih dahulu!";
    return;
  }

  if (!startMonth.value || !endMonth.value) {
    monthRangeError.value = "Silakan lengkapi bulan mulai dan bulan akhir!";
    return;
  }

  if (!selectedEntityId.value) {
    monthRangeError.value = "Silakan pilih entity (cabang/unit) di filter sidebar terlebih dahulu!";
    return;
  }

  const year = Number(selectedYear.value);
  const startM = Number(startMonth.value);
  const endM = Number(endMonth.value);

  // Validate range - bulan mulai harus <= bulan akhir
  if (startM > endM) {
    monthRangeError.value = "Bulan mulai harus lebih kecil atau sama dengan bulan akhir!";
    return;
  }

  try {
    loading.value = true;
    isGlobalLoading.value = true;

    // Reset data
    apiData.value = {
      success: false,
      entity_id: "",
      entityIds: [],
      rate_satu: {},
      rate_dua: {},
      rate_tiga: {},
      rate_empat: {},
      rate_lima: {},
      rate_enam: {},
      rate_tujuh: {},
    };

    apiRatioData.value = {
      success: false,
      entity_id: "",
      entityIds: [],
      rasioSatu: {},
      rasioDua: {},
      rasioTiga: {},
      rasioEmpat: {},
      rasioLima: {},
      rasioEnam: {},
      rasioTujuh: {},
      rasioDelapan: {},
      rasioSembilan: {},
      rasioSepuluh: {},
      rasioSebelas: {},
    };

    // Fetch data for range in single API call
    const rateResponse = await fetchRateListRange(year, startM, endM);
    if (rateResponse && rateResponse.success) {
      apiData.value = rateResponse;
    }

    const ratioResponse = await fetchRatioListRange(year, startM, endM);
    if (ratioResponse && ratioResponse.success) {
      apiRatioData.value = ratioResponse;
    }

    // Clear error on success
    monthRangeError.value = "";

    // Set all collapsed true by default
    apiData.value.entityIds.forEach((e: entityIds) => {
      const uniqueId = `rate-${e.id}`;
      if (!(uniqueId in collapsed)) collapsed[uniqueId] = true;
    });

    apiRatioData.value.entityIds.forEach((e: entityIds) => {
      const uniqueId = `ratio-${e.id}`;
      if (!(uniqueId in collapsed)) collapsed[uniqueId] = true;
    });
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isGlobalLoading.value = false;
  }
};

// Auto-apply filter when all required values are available
const checkAndApplyFilter = async () => {
  if (
    selectedYear.value &&
    startMonth.value &&
    endMonth.value &&
    selectedEntityId.value
  ) {
    await applyRangeFilter();
  }
};

// Watch for changes in required filters and auto-apply
watch([selectedYear, selectedEntityId], () => {
  checkAndApplyFilter();
});

onMounted(() => {
  if (!authStore.user?.value) return;
  // Auto-apply filter on mount if all conditions are met
  checkAndApplyFilter();
});
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
}

.range-filter-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.range-filter-section h3 {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.range-info {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-info i {
  font-size: 1rem;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.error-text {
  margin-top: 12px;
  padding: 12px;
  font-size: 0.875rem;
  color: #dc2626;
  background-color: #fef2f2;
  border-left: 4px solid #dc2626;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.error-text::before {
  content: "⚠";
  font-size: 1rem;
  flex-shrink: 0;
}

.btn-apply {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.btn-apply:hover {
  background-color: #2563eb;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.section-header p {
  font-size: 0.875rem;
  color: #6b7280;
}

.loading {
  text-align: center;
  padding: 80px 0;
  color: #6b7280;
  font-weight: 500;
}

.entity-card {
  margin-bottom: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.entity-header {
  padding: 16px 24px;
  background-color: #f3f4f6;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.entity-header:hover {
  background-color: #e5e7eb;
}

.entity-name {
  font-size: 1.125rem;
  color: #111827;
}

.arrow {
  transition: transform 0.2s ease;
}

.arrow.rotated {
  transform: rotate(90deg);
}

.entity-content {
  padding: 24px;
  background-color: #fff;
}

.metric-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  font-weight: 600;
  padding: 12px 16px;
  color: #fff;
}

.card-header.blue {
  background-color: #3b82f6;
}

.card-header.green {
  background-color: #10b981;
}

.card-header.yellow {
  background-color: #f59e0b;
}

.card-header.purple {
  background-color: #8b5cf6;
}

.card-body {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px 16px;
}

thead th {
  text-align: left;
  background-color: #f9fafb;
  color: #374151;
}

td {
  text-align: right;
}

td:first-child {
  text-align: left;
}

tbody tr:hover {
  background-color: #f3f4f6;
}

/* Collapse animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  padding: 0 24px;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 2000px;
  opacity: 1;
  padding: 24px;
}

.table .empty {
  text-align: center;
  color: #6b7280;
}

.empty {
  text-align: center;
  color: #6b7280;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #6b7280;
}
</style>
