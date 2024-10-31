import {observer} from "mobx-react-lite";
import store from "../../store/store.ts";
import React, {useEffect} from "react";
import {useRef, useState} from "react";
import {Avatar, List, Button} from "antd";
import styles from './styles.module.css'
import {LoadingOutlined} from "@ant-design/icons";

type optionObject = {
    rootMargin : string,
    threshold : number,
}

interface Post {
    id: number,
    text : string
}


const ItemList = observer(() => {
    // первый рендер и загрузка данных
    const hasFetchedData = useRef<boolean>(false);
    useEffect(() => {
        if (hasFetchedData.current) return;
        store.fetchData();
        hasFetchedData.current = true;
    }, [])

    //  бесконечный скролл
    const lastItemRef = useRef<HTMLDivElement | null>(null)
    const options:optionObject = {
        rootMargin: '0px 0px -30px 0px',
        threshold: 1,
    }

    useEffect(() => {
        const observer: IntersectionObserver  = new IntersectionObserver((entries:IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && lastItemRef.current === entries[0].target && !store.isLoading) {
                store.fetchData();
                observer.unobserve(lastItemRef.current)
            }
        }, options);

        if (lastItemRef.current) {
            observer.observe(lastItemRef.current);
        }

        return () => {
            if (lastItemRef.current) {
                observer.unobserve(lastItemRef.current);
            }
        };
    }, [lastItemRef, options]);


    // для редактирования текста
    const [editPostId, setEditPostId] = useState<number | null>(null);
    const [editText, setEditText] = useState<string>('');

    const handleEditClick = (post:Post):void => {
        setEditPostId(post.id);
        setEditText(post.text);
    };

    const handleSaveEdit = (id : number) :void => {
        const postIndex = store.posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            store.posts[postIndex].text = editText;
            setEditPostId(null);
            setEditText('');
        }
    };


    return (
        <>
            {store.posts.length === 0 ? <LoadingOutlined data-testid="loading-indicator" className={styles.loadingElem}/> : (
                <>
                    <h2 className={styles.titleList}>Записи сообщества</h2>
                    <List
                        className={styles.list}
                        itemLayout={"vertical"}
                        dataSource={store.posts}
                        renderItem={(item, index) => (
                            <List.Item
                                className={styles.listItem}
                                actions={
                                    [<Button className={styles.customButton}
                                             onClick={() => store.deleteFunction(item.id)}>Удалить</Button>,
                                        <Button
                                            onClick={() => handleEditClick(item)}>Редактировать</Button>]}
                                ref={(index + 1 === store.posts.length) ? lastItemRef : null}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={'VkImage.jpg'}
                                                    className={styles.avatar}/>}
                                    title={<span
                                        className={styles.customTitle}>VK</span>}
                                    description={
                                        editPostId === item.id ? (
                                            <div
                                                className={styles.inputWrapper}>
                                                <textarea
                                                    className={styles.customInput}
                                                    value={editText}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
                                                />
                                                <Button
                                                    className={styles.customInputButton}
                                                    onClick={() => handleSaveEdit(item.id)}>Сохранить</Button>
                                            </div>
                                        ) : (
                                            <span
                                                className={styles.customDescription}>{item.text}</span>
                                        )
                                    }

                                />
                            </List.Item>
                        )}></List>
                    {store.isLoading && <LoadingOutlined className={styles.loadingElem}/>}
                </>
            )}

        </>


    )
})

export default ItemList