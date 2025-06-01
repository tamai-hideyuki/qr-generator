import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

window.URL.createObjectURL = jest.fn(() => 'blob:mocked-url');

import QRGenerator from './QRGenerator';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('QRGenerator コンポーネント', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  test('空の URL で「生成」押下するとバリデーションエラーが出る', async () => {
    render(<QRGenerator />);
    // 何も入力せずに「生成」をクリック
    await userEvent.click(screen.getByText('生成'));
    // 「URL を入力してください。」が表示される
    expect(await screen.findByText('URL を入力してください。')).toBeInTheDocument();
    // axios.post は呼ばれていない
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('不正な URL で「生成」押下するとバリデーションエラーが出る', async () => {
    render(<QRGenerator />);

    const input = screen.getByPlaceholderText('QRコードにしたいURLを入力してください');
    // 非同期で入力を待つ
    await userEvent.type(input, 'invalid-url');
    await userEvent.click(screen.getByText('生成'));

    // 「有効な URL を入力してください（例: https://example.com）。」が表示される
    expect(
        await screen.findByText('有効な URL を入力してください（例: https://example.com）。')
    ).toBeInTheDocument();

    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('正常な URL で「生成」押下すると API 呼び出し → 画像が表示される', async () => {
    render(<QRGenerator />);

    const input = screen.getByPlaceholderText('QRコードにしたいURLを入力してください');

    // 擬似 Blob を返すようにモック化
    const fakeBlob = new Blob(['fake'], { type: 'image/png' });
    mockedAxios.post.mockResolvedValue({
      data: fakeBlob,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });

    // 非同期で入力
    await userEvent.type(input, 'https://example.com');
    // クリックして API 呼び出しトリガー
    await userEvent.click(screen.getByText('生成'));

    // axios.post が呼び出されるまで待機
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:8000/qr/generate_qr',
          { data: 'https://example.com', size: 256 },
          { responseType: 'blob' }
      );
    });

   // 画像が表示されるまで待機（createObjectURL がモックされているため img がレンダー）
       const img = await screen.findByRole('img');
   expect(img).toBeInTheDocument();
   expect(img).toHaveAttribute('src', 'blob:mocked-url');

    // 画像が表示された後は、ボタンラベルが「生成」に戻っていることを確認
    expect(screen.getByText('生成')).toBeInTheDocument();
  });

  test('API からエラーが返った場合にエラーメッセージが表示される', async () => {
    render(<QRGenerator />);

    const input = screen.getByPlaceholderText('QRコードにしたいURLを入力してください');

    // 500 エラーを投げるようにモック化
    mockedAxios.post.mockRejectedValue({ response: { status: 500 } });

    // 非同期で入力
    await userEvent.type(input, 'https://example.com');
    // クリックして API 呼び出しトリガー
    await userEvent.click(screen.getByText('生成'));

    // 「サーバーエラー: 500」が表示されるまで待機
    expect(await screen.findByText(/サーバーエラー: 500/)).toBeInTheDocument();
  });
});
