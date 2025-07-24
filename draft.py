# import pandas as pd

# # 读取CSV文件
# df = pd.read_csv('main_df_4.1.csv')

# # 截取前xxx行
# df_headxxx = df.head(7500)

# # 保存为新的CSV文件
# df_headxxx.to_csv('main_df_4.1_head7500.csv', index=False)




# import pandas as pd

# # 读取CSV文件
# df = pd.read_csv('main_df_renamed.csv')

# # 获取holiday字段的所有唯一取值
# unique_holiday = df['holiday'].unique()
# print(unique_holiday)


# import pandas as pd

# # 读取CSV文件
# df = pd.read_csv('main_df_v3.0.csv')

# # 提取item_nbr列的所有唯一取值
# item_nbr_values = df['item_nbr'].unique()

# # 打印所有item_nbr的取值
# print(item_nbr_values)

# import pandas as pd

# # 你的商品序号列表
# item_nbr_list = [
#     402175, 459804, 759694, 1124165, 108952, 655749, 1132005, 1005465, 119193,
#     660310, 1686685, 1313223, 1472479, 1354390, 1354383, 1349808, 1441514, 1471460,
#     2010456, 2048246
# ]

# # 读取CSV文件
# df = pd.read_csv('main_df_v3.0.csv')

# # 只保留item_nbr在你的列表中的数据
# df_filtered = df[df['item_nbr'].isin(item_nbr_list)]

# # 按item_nbr分组，每组取第一行
# first_occurrence = df_filtered.groupby('item_nbr', as_index=False).first()

# # 打印或保存结果
# print(first_occurrence)





# # # 输出项目结构
# import os

# IGNORED = {"__pycache__", "node_modules", ".git", ".venv", "build", "dist", ".next", ".idea", ".vscode"}

# def list_dir_structure(startpath=".", output_file="project_structure.txt", max_depth=6):
#     with open(output_file, "w", encoding="utf-8") as f:
#         for root, dirs, files in os.walk(startpath):
#             depth = root.replace(startpath, "").count(os.sep)
#             if depth >= max_depth:
#                 dirs[:] = []  # 不再深入
#                 continue
#             dirs[:] = [d for d in dirs if d not in IGNORED]
#             indent = " " * 4 * depth
#             f.write(f"{indent}{os.path.basename(root)}/\n")
#             subindent = " " * 4 * (depth + 1)
#             for file in files:
#                 f.write(f"{subindent}{file}\n")

# list_dir_structure()






# import pandas as pd

# # 读取原始 CSV 文件
# df = pd.read_csv("main_df_4.1.csv")

# # 筛选 store_nbr 为 1 的行
# filtered_df = df[df["store_nbr"] == 1]

# # 将结果保存为新的 CSV 文件
# filtered_df.to_csv("main_df_4.2.csv", index=False)

# print("筛选完成，已保存为 main_df_4.2.csv")




# import pandas as pd

# # 读取CSV文件
# df = pd.read_csv('main_df_4.2.csv')

# # 保留标题行和第352行及其以后的数据（索引从0开始，所以351是第352行）
# df_new = df.iloc[10739:]

# # 保存到新CSV文件
# df_new.to_csv('main_df_4.2_1M.csv', index=False)



# import pandas as pd

# # 读取CSV文件
# df = pd.read_csv('main_df_4.2_1M.csv')

# # 替换item_category列的值
# df['category'] = df['category'].replace('GROCERY I', 'Pantry Staples')

# # 保存回CSV文件
# df.to_csv('main_df_4.3_1M.csv', index=False)



# import pandas as pd

# # 读取CSV文件
# df = pd.read_csv('main_df_4.3_1M.csv')

# # 删除指定的列
# df = df.drop(columns=['item_category'])

# # 保存为新的CSV文件（可以覆盖原文件）
# df.to_csv('main_df_4.4_1M.csv', index=False)
