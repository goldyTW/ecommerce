import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../components/Layout'
import Product from '../models/Product';
import data from '../utils/data';
import db from '../utils/db';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

export default function Home(props) {
   const classes = useStyles();
  const router = useRouter();
  const {products} = props;
  const { state, dispatch } = useContext(Store);
  const { topRatedProducts, featuredProducts } = props;
  
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    <Layout>
    <div>
      <h1>Products</h1>
       <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product.name}>
            <Card>
              <Link href={`/product/${product.slug}`} passHref>
              <CardActionArea>
                <Image
                  // compontent="img"
                  width={400}
                  height={400}
                  src={product.image}
                  alt={product.name}>
                </Image>
                <CardContent>
                  <Typography>{product.name}</Typography>
                </CardContent>
              </CardActionArea>          
              </Link>
              <CardActions>
                <Typography>${product.price}</Typography>
                <Button size="small" color="secondary" onClick={() => addToCartHandler(product)}>Add to Cart</Button>
              </CardActions>
            </Card>
            {/* <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            /> */}
          </Grid>
        ))}
      </Grid>
    </div>
    </Layout>
   
  )
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  // const featuredProductsDocs = await Product.find(
  //   { isFeatured: true },
  //   '-reviews'
  // )
  //   .lean()
  //   .limit(3);
  // const topRatedProductsDocs = await Product.find({}, '-reviews')
  //   .lean()
  //   .sort({
  //     rating: -1,
  //   })
  //   .limit(6);
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
      // featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      // topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}
