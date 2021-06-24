-- SQLite
select ticker, time, join_table.* from ticker_history
left join ticker_ask_history join_table on ticker_history.askId = join_table.id
where ticker="ETHUSD" order by ticker_history.id desc;
